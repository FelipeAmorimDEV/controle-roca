import { FastifyRequest, FastifyReply } from 'fastify';
import { PrismaAISuggestionRepository } from '../../../repository/ai-suggestion-repository';
import { prisma } from '../../../prisma';

export async function debugMotivosSugestoes(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const user = (request as any).user;
    const fazendaId = user?.fazenda_id;
    
    if (!fazendaId) {
      return reply.status(400).send({
        error: 'Não foi possível extrair fazendaId do token JWT'
      });
    }

    const aiSuggestionRepository = new PrismaAISuggestionRepository(prisma);

    // Busca todos os setores da fazenda
    const setores = await prisma.setor.findMany({
      where: { fazenda_id: fazendaId },
      select: { 
        id: true, 
        setorName: true, 
        dataPoda: true 
      },
    });

    // Análise detalhada de cada setor
    const analiseSetores = await Promise.all(setores.map(async (setor) => {
      try {
        const dadosSetor = await aiSuggestionRepository.buscarDadosSetor(setor.id);
        
        if (!dadosSetor) {
          return {
            setorId: setor.id,
            setorNome: setor.setorName,
            motivo: 'Dados do setor não encontrados',
            dataPoda: setor.dataPoda?.toISOString() || null,
            faseAtual: null,
            diasAposPoda: 0,
            historicoTotal: 0,
            aplicacoesPorFase: {},
            confiabilidade: 0
          };
        }

        // Calcula fase atual
        let faseAtual = null;
        let diasAposPoda = 0;
        if (dadosSetor.dataPoda) {
          try {
            const { calcularFaseSetor } = require('../../../utils/faseCalculator');
            const { faseAtual: fase, diasAposPoda: dias } = calcularFaseSetor(dadosSetor.dataPoda);
            faseAtual = fase?.nome || null;
            diasAposPoda = dias;
          } catch (error) {
            console.error('Erro ao calcular fase:', error);
            faseAtual = null;
            diasAposPoda = 0;
          }
        }

        // Conta aplicações por fase e tipo
        const aplicacoesPorFase = new Map<string, number>();
        dadosSetor.historicoAplicacoes.forEach(app => {
          const chave = `${app.faseFenologica}-${app.tipo}`;
          aplicacoesPorFase.set(chave, (aplicacoesPorFase.get(chave) || 0) + 1);
        });

        // Determina motivo da falta de sugestão
        let motivo = 'Tem sugestão';
        let detalhes = [];

        if (!faseAtual) {
          motivo = 'Sem dataPoda';
          detalhes.push('Setor não possui dataPoda registrada');
        } else if (dadosSetor.historicoAplicacoes.length < 3) {
          motivo = 'Pouco histórico geral';
          detalhes.push(`Apenas ${dadosSetor.historicoAplicacoes.length} aplicações no histórico (mínimo: 3)`);
        } else {
          const chaveFertirrigacao = `${faseAtual}-fertirrigacao`;
          const chavePulverizacao = `${faseAtual}-pulverizacao`;
          const aplicacoesFertirrigacao = aplicacoesPorFase.get(chaveFertirrigacao) || 0;
          const aplicacoesPulverizacao = aplicacoesPorFase.get(chavePulverizacao) || 0;
          
          if (aplicacoesFertirrigacao < 3 && aplicacoesPulverizacao < 3) {
            motivo = 'Pouco histórico na fase atual';
            detalhes.push(`Fase atual: ${faseAtual}`);
            detalhes.push(`Fertirrigações na fase: ${aplicacoesFertirrigacao} (mínimo: 3)`);
            detalhes.push(`Pulverizações na fase: ${aplicacoesPulverizacao} (mínimo: 3)`);
          } else {
            motivo = 'Tem sugestão';
            detalhes.push(`Fase: ${faseAtual}`);
            detalhes.push(`Fertirrigações: ${aplicacoesFertirrigacao}`);
            detalhes.push(`Pulverizações: ${aplicacoesPulverizacao}`);
          }
        }

        return {
          setorId: setor.id,
          setorNome: setor.setorName,
          motivo,
          detalhes,
          dataPoda: setor.dataPoda?.toISOString() || null,
          faseAtual,
          diasAposPoda,
          historicoTotal: dadosSetor.historicoAplicacoes.length,
          aplicacoesPorFase: Object.fromEntries(aplicacoesPorFase),
          confiabilidade: 0
        };
      } catch (error) {
        return {
          setorId: setor.id,
          setorNome: setor.setorName,
          motivo: 'Erro ao analisar',
          detalhes: [error instanceof Error ? error.message : 'Erro desconhecido'],
          dataPoda: setor.dataPoda?.toISOString() || null,
          faseAtual: null,
          diasAposPoda: 0,
          historicoTotal: 0,
          aplicacoesPorFase: {},
          confiabilidade: 0
        };
      }
    }));

    // Estatísticas gerais
    const estatisticas = {
      totalSetores: setores.length,
      setoresComDataPoda: setores.filter(s => s.dataPoda).length,
      setoresSemDataPoda: setores.filter(s => !s.dataPoda).length,
      setoresComSugestoes: analiseSetores.filter(s => s.motivo === 'Tem sugestão').length,
      setoresSemSugestoes: analiseSetores.filter(s => s.motivo !== 'Tem sugestão').length,
      motivos: {
        'Sem dataPoda': analiseSetores.filter(s => s.motivo === 'Sem dataPoda').length,
        'Pouco histórico geral': analiseSetores.filter(s => s.motivo === 'Pouco histórico geral').length,
        'Pouco histórico na fase atual': analiseSetores.filter(s => s.motivo === 'Pouco histórico na fase atual').length,
        'Tem sugestão': analiseSetores.filter(s => s.motivo === 'Tem sugestão').length,
        'Erro ao analisar': analiseSetores.filter(s => s.motivo === 'Erro ao analisar').length,
      }
    };

    return reply.status(200).send({
      success: true,
      fazendaId,
      estatisticas,
      analiseSetores
    });

  } catch (error) {
    console.error('Erro no debug de motivos:', error);
    return reply.status(500).send({
      error: 'Erro interno do servidor',
      message: error instanceof Error ? error.message : 'Erro desconhecido',
      stack: error instanceof Error ? error.stack : undefined,
    });
  }
}
