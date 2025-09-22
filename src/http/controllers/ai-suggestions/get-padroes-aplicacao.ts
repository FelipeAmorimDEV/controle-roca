import { FastifyRequest, FastifyReply } from 'fastify';
import { AISuggestionService } from '../../../services/ai-suggestion-service';
import { PrismaAISuggestionRepository } from '../../../repository/ai-suggestion-repository';
import { prisma } from '../../../prisma';
import { calcularFaseSetor } from '../../../utils/faseCalculator';

interface GetPadroesAplicacaoQuery {
  fazendaId?: string;
  dataInicio?: string;
  dataFim?: string;
}

export async function getPadroesAplicacao(
  request: FastifyRequest<{
    Querystring: GetPadroesAplicacaoQuery;
  }>,
  reply: FastifyReply
) {
  try {
    const { fazendaId, dataInicio, dataFim } = request.query;

    // Extrai fazendaId do token JWT se não fornecida como parâmetro
    let fazendaIdFinal = fazendaId;
    if (!fazendaId) {
      // Tenta extrair do token JWT
      const user = (request as any).user;
      if (user && user.fazenda_id) {
        fazendaIdFinal = user.fazenda_id;
      } else {
        return reply.status(400).send({
          error: 'fazendaId é obrigatório ou é necessário estar autenticado com fazenda válida'
        });
      }
    }

    // Converte datas se fornecidas
    let dataInicioDate: Date | undefined;
    let dataFimDate: Date | undefined;

    if (dataInicio) {
      dataInicioDate = new Date(dataInicio);
      if (isNaN(dataInicioDate.getTime())) {
        return reply.status(400).send({
          error: 'Data de início inválida'
        });
      }
    }

    if (dataFim) {
      dataFimDate = new Date(dataFim);
      if (isNaN(dataFimDate.getTime())) {
        return reply.status(400).send({
          error: 'Data de fim inválida'
        });
      }
    }

    // Define período padrão se não fornecido
    const dataInicioFinal = dataInicioDate || new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
    const dataFimFinal = dataFimDate || new Date();

    // Inicializa dependências
    const aiSuggestionRepository = new PrismaAISuggestionRepository(prisma);
    const aiSuggestionService = new AISuggestionService();

    // Busca dados de todos os setores da fazenda
    const dadosSetores = await aiSuggestionRepository.buscarHistoricoCompletoFazenda(
      fazendaIdFinal,
      dataInicioFinal,
      dataFimFinal
    );

    // Processa cada setor para calcular fases e analisar padrões
    const padroesPorFase = new Map<string, any>();
    const estatisticas = {
      totalSetores: dadosSetores.length,
      setoresComDataPoda: 0,
      setoresComHistorico: 0,
      totalAplicacoes: 0,
      fasesIdentificadas: new Set<string>()
    };

    for (const dadosSetor of dadosSetores) {
      // Calcula fase atual se houver data de poda
      if (dadosSetor.dataPoda) {
        estatisticas.setoresComDataPoda++;
        const { faseAtual, diasAposPoda } = calcularFaseSetor(dadosSetor.dataPoda);
        
        if (faseAtual) {
          estatisticas.fasesIdentificadas.add(faseAtual.nome);
        }
      }

      if (dadosSetor.historicoAplicacoes.length > 0) {
        estatisticas.setoresComHistorico++;
        estatisticas.totalAplicacoes += dadosSetor.historicoAplicacoes.length;

        // Calcula fases retroativas para o histórico
        const historicoComFases = await calcularFasesRetroativas(dadosSetor);
        dadosSetor.historicoAplicacoes = historicoComFases;

        // Analisa padrões
        const { padroes } = aiSuggestionService.processarSugestoes(dadosSetor);
        
        // Agrupa padrões por fase
        padroes.forEach((padrao, chave) => {
          if (!padroesPorFase.has(chave)) {
            padroesPorFase.set(chave, {
              faseFenologica: padrao.faseFenologica,
              tipo: padrao.tipo,
              totalAplicacoes: 0,
              frequenciaMedia: 0,
              confiabilidadeMedia: 0,
              produtos: new Map()
            });
          }

          const padraoExistente = padroesPorFase.get(chave)!;
          padraoExistente.totalAplicacoes++;
          padraoExistente.frequenciaMedia += padrao.frequenciaMedia;
          padraoExistente.confiabilidadeMedia += padrao.confiabilidade;

          // Agrupa produtos
          padrao.produtos.forEach(produto => {
            if (!padraoExistente.produtos.has(produto.produtoId)) {
              padraoExistente.produtos.set(produto.produtoId, {
                nome: produto.nome,
                quantidadeMedia: 0,
                variacao: 0,
                unidade: produto.unidade,
                frequencia: 0
              });
            }

            const produtoExistente = padraoExistente.produtos.get(produto.produtoId)!;
            produtoExistente.quantidadeMedia += produto.quantidadeMedia;
            produtoExistente.variacao += produto.variacao;
            produtoExistente.frequencia++;
          });
        });
      }
    }

    // Calcula médias finais
    const padroesFinais = Array.from(padroesPorFase.entries()).map(([chave, padrao]) => {
      const totalPadroes = padrao.totalAplicacoes;
      
      return {
        faseFenologica: padrao.faseFenologica,
        tipo: padrao.tipo,
        totalAplicacoes: totalPadroes,
        frequenciaMedia: padrao.frequenciaMedia / totalPadroes,
        confiabilidadeMedia: padrao.confiabilidadeMedia / totalPadroes,
        produtos: Array.from(padrao.produtos.entries()).map(([produtoId, produto]) => ({
          produtoId,
          nome: produto.nome,
          quantidadeMedia: produto.quantidadeMedia / produto.frequencia,
          variacao: produto.variacao / produto.frequencia,
          unidade: produto.unidade,
          frequencia: produto.frequencia
        }))
      };
    });

    return reply.status(200).send({
      success: true,
      data: {
        padroes: padroesFinais,
        estatisticas: {
          ...estatisticas,
          fasesIdentificadas: Array.from(estatisticas.fasesIdentificadas)
        }
      }
    });

  } catch (error) {
    console.error('Erro ao buscar padrões de aplicação:', error);
    return reply.status(500).send({
      error: 'Erro interno do servidor',
      message: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
}

/**
 * Calcula fases fenológicas retroativas para o histórico de aplicações
 */
async function calcularFasesRetroativas(dadosSetor: any): Promise<any[]> {
  if (!dadosSetor.dataPoda) return dadosSetor.historicoAplicacoes;

  const historicoComFases = dadosSetor.historicoAplicacoes.map((aplicacao: any) => {
    // Calcula quantos dias atrás foi a aplicação
    const diasAtras = Math.floor(
      (dadosSetor.dataPoda.getTime() - aplicacao.dataAplicacao.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Se a aplicação foi antes da poda atual, calcula fase retroativa
    if (diasAtras > 0) {
      const faseRetroativa = calcularFaseRetroativa(dadosSetor.dataPoda, diasAtras);
      return {
        ...aplicacao,
        faseFenologica: faseRetroativa || 'Desconhecida'
      };
    }

    // Se a aplicação foi após a poda, calcula fase normal
    const diasAposPoda = Math.floor(
      (aplicacao.dataAplicacao.getTime() - dadosSetor.dataPoda.getTime()) / (1000 * 60 * 60 * 24)
    );

    const { faseAtual } = calcularFaseSetor(dadosSetor.dataPoda);
    return {
      ...aplicacao,
      faseFenologica: faseAtual?.nome || 'Desconhecida'
    };
  });

  return historicoComFases;
}

/**
 * Calcula fase fenológica retroativa baseada na data de poda e dias atrás
 */
function calcularFaseRetroativa(dataPoda: Date, diasAtras: number): string | null {
  const diasAposPoda = Math.floor((Date.now() - dataPoda.getTime()) / (1000 * 60 * 60 * 24));
  const diasRetroativos = diasAposPoda - diasAtras;
  
  if (diasRetroativos < 0) return null;
  
  const { obterFaseAtual } = require('../../../utils/faseCalculator');
  const fase = obterFaseAtual(diasRetroativos);
  
  return fase?.nome || null;
}
