import { FastifyRequest, FastifyReply } from 'fastify';
import { PrismaAISuggestionRepository } from '../../../repository/ai-suggestion-repository';
import { prisma } from '../../../prisma';

export async function debugFasesSetor(
  request: FastifyRequest<{ Params: { setorId: string } }>,
  reply: FastifyReply
) {
  try {
    const { setorId } = request.params;
    
    const aiSuggestionRepository = new PrismaAISuggestionRepository(prisma);
    
    // Busca dados do setor
    const dadosSetor = await aiSuggestionRepository.buscarDadosSetor(setorId);
    
    if (!dadosSetor) {
      return reply.status(404).send({
        error: 'Setor não encontrado'
      });
    }

    // Busca algumas aplicações para testar
    const aplicacoes = await prisma.aplicacao.findMany({
      where: { setorId },
      take: 5,
      orderBy: { createdAt: 'desc' }
    });

    const fertirrigacoes = await prisma.fertirrigacao.findMany({
      where: { setor_id: setorId },
      take: 5,
      orderBy: { created_at: 'desc' }
    });

    // Testa cálculo de fases
    const { obterFaseAtual } = require('../../../utils/faseCalculator');
    
    const testeFases = [];
    
    // Testa fases conhecidas
    for (let dias = 0; dias <= 120; dias += 10) {
      const fase = obterFaseAtual(dias);
      testeFases.push({
        dias,
        fase: fase?.nome || 'Desconhecida'
      });
    }

    // Testa algumas aplicações reais
    const aplicacoesTeste = aplicacoes.map(app => {
      if (!dadosSetor.dataPoda) return null;
      
      const diasAposPoda = Math.floor(
        (app.createdAt.getTime() - dadosSetor.dataPoda.getTime()) / (1000 * 60 * 60 * 24)
      );
      
      const fase = obterFaseAtual(diasAposPoda);
      
      return {
        id: app.id,
        dataAplicacao: app.createdAt,
        dataPoda: dadosSetor.dataPoda,
        diasAposPoda,
        fase: fase?.nome || 'Desconhecida'
      };
    }).filter(Boolean);

    return reply.status(200).send({
      success: true,
      setor: {
        id: dadosSetor.id,
        nome: dadosSetor.nome,
        dataPoda: dadosSetor.dataPoda,
        faseAtual: dadosSetor.faseAtual,
        diasAposPoda: dadosSetor.diasAposPoda
      },
      testeFases,
      aplicacoesTeste,
      totalAplicacoes: aplicacoes.length,
      totalFertirrigacoes: fertirrigacoes.length
    });

  } catch (error) {
    console.error('Erro no debug de fases:', error);
    return reply.status(500).send({
      error: 'Erro interno do servidor',
      message: error instanceof Error ? error.message : 'Erro desconhecido',
      stack: error instanceof Error ? error.stack : undefined,
    });
  }
}
