import { FastifyRequest, FastifyReply } from 'fastify';
import { AISuggestionService } from '../../../services/ai-suggestion-service';
import { PrismaAISuggestionRepository } from '../../../repository/ai-suggestion-repository';
import { prisma } from '../../../prisma';
import { calcularFaseSetor } from '../../../utils/faseCalculator';

interface AplicarSugestaoIAParams {
  setorId: string;
}

interface AplicarSugestaoIABody {
  tipo: 'fertirrigacao' | 'pulverizacao';
  sugestaoId: string;
  observacoes?: string;
}

export async function aplicarSugestaoIA(
  request: FastifyRequest<{
    Params: AplicarSugestaoIAParams;
    Body: AplicarSugestaoIABody;
  }>,
  reply: FastifyReply
) {
  try {
    const { setorId } = request.params;
    const { tipo, sugestaoId, observacoes } = request.body;

    // Validação de parâmetros
    if (!tipo || !sugestaoId) {
      return reply.status(400).send({
        error: 'tipo e sugestaoId são obrigatórios'
      });
    }

    if (!['fertirrigacao', 'pulverizacao'].includes(tipo)) {
      return reply.status(400).send({
        error: 'tipo deve ser "fertirrigacao" ou "pulverizacao"'
      });
    }

    // Busca dados do setor
    const aiSuggestionRepository = new PrismaAISuggestionRepository(prisma);
    const dadosSetor = await aiSuggestionRepository.buscarDadosSetor(setorId);

    if (!dadosSetor) {
      return reply.status(404).send({
        error: 'Setor não encontrado'
      });
    }

    // Calcula fase atual
    let faseAtual = null;
    if (dadosSetor.dataPoda) {
      const { faseAtual: fase } = calcularFaseSetor(dadosSetor.dataPoda);
      faseAtual = fase?.nome || null;
    }

    // Gera nova sugestão para aplicar
    const aiSuggestionService = new AISuggestionService();
    const { sugestaoFertirrigacao, sugestaoPulverizacao } = 
      aiSuggestionService.processarSugestoes(dadosSetor);

    const sugestao = tipo === 'fertirrigacao' ? sugestaoFertirrigacao : sugestaoPulverizacao;

    if (!sugestao) {
      return reply.status(404).send({
        error: `Nenhuma sugestão de ${tipo} disponível para este setor`
      });
    }

    // Aplica a sugestão baseada no tipo
    let resultado;

    if (tipo === 'fertirrigacao') {
      resultado = await aplicarFertirrigacao(setorId, sugestao, observacoes);
    } else {
      resultado = await aplicarPulverizacao(setorId, sugestao, observacoes);
    }

    return reply.status(201).send({
      success: true,
      message: `${tipo} aplicada com sucesso`,
      data: {
        id: resultado.id,
        setorId,
        faseFenologica: faseAtual,
        tipo,
        produtos: sugestao.produtos,
        confianca: sugestao.confianca,
        observacoes: observacoes || sugestao.observacoes
      }
    });

  } catch (error) {
    console.error('Erro ao aplicar sugestão de IA:', error);
    return reply.status(500).send({
      error: 'Erro interno do servidor',
      message: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
}

/**
 * Aplica uma sugestão de fertirrigação
 */
async function aplicarFertirrigacao(
  setorId: string, 
  sugestao: any, 
  observacoes?: string
): Promise<any> {
  // Busca um funcionário ativo para ser o aplicador
  const funcionario = await prisma.funcionario.findFirst({
    where: { ativo: true }
  });

  if (!funcionario) {
    throw new Error('Nenhum funcionário ativo encontrado');
  }

  // Cria a fertirrigação
  const fertirrigacao = await prisma.fertirrigacao.create({
    data: {
      setor_id: setorId,
      aplicador_id: funcionario.id,
      fazenda_id: funcionario.fazenda_id,
      semana: getSemanaAtual(),
      finalized_at: new Date()
    }
  });

  // Cria os produtos da fertirrigação
  for (const produto of sugestao.produtos) {
    await prisma.produtoFertirrigacao.create({
      data: {
        fertirrigacaoId: fertirrigacao.id,
        produto_id: produto.produtoId,
        quantidade: produto.quantidade
      }
    });

    // Cria saída no estoque
    await prisma.saida.create({
      data: {
        productId: produto.produtoId,
        quantity: produto.quantidade,
        priceSaida: 0, // Será calculado baseado no estoque
        usersId: funcionario.id,
        fazenda_id: funcionario.fazenda_id,
        setorId: setorId,
        fertirrigacaoId: fertirrigacao.id
      }
    });
  }

  return fertirrigacao;
}

/**
 * Aplica uma sugestão de pulverização
 */
async function aplicarPulverizacao(
  setorId: string, 
  sugestao: any, 
  observacoes?: string
): Promise<any> {
  // Busca um funcionário ativo para ser o aplicador
  const funcionario = await prisma.funcionario.findFirst({
    where: { ativo: true }
  });

  if (!funcionario) {
    throw new Error('Nenhum funcionário ativo encontrado');
  }

  // Cria a aplicação
  const aplicacao = await prisma.aplicacao.create({
    data: {
      setorId: setorId,
      aplicador: funcionario.nome,
      volumeCalda: sugestao.volumeCalda,
      fazenda_id: funcionario.fazenda_id,
      produtosAplicados: JSON.stringify(sugestao.produtos.map((p: any) => ({
        produto: p.produtoId,
        dosagem: p.dosagem,
        total: p.dosagem * sugestao.volumeCalda
      })))
    }
  });

  // Cria saídas no estoque para cada produto
  for (const produto of sugestao.produtos) {
    await prisma.saida.create({
      data: {
        productId: produto.produtoId,
        quantity: produto.dosagem,
        priceSaida: 0, // Será calculado baseado no estoque
        usersId: funcionario.id,
        fazenda_id: funcionario.fazenda_id,
        setorId: setorId,
        aplicacaoId: aplicacao.id
      }
    });
  }

  return aplicacao;
}

/**
 * Retorna a semana atual no formato YYYY-WW
 */
function getSemanaAtual(): string {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const inicioAno = new Date(ano, 0, 1);
  const dias = Math.floor((hoje.getTime() - inicioAno.getTime()) / (1000 * 60 * 60 * 24));
  const semana = Math.ceil((dias + inicioAno.getDay() + 1) / 7);
  return `${ano}-${semana.toString().padStart(2, '0')}`;
}
