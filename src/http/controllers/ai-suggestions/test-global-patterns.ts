import { FastifyRequest, FastifyReply } from 'fastify';
import { PrismaAISuggestionRepository } from '../../../repository/ai-suggestion-repository';
import { prisma } from '../../../prisma';

export async function testGlobalPatterns(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const fazendaId = (request as any).user?.fazenda_id;
    
    if (!fazendaId) {
      return reply.status(400).send({
        error: 'FazendaId é obrigatório'
      });
    }

    console.log('Testando busca de padrões globais...');
    console.log(`FazendaId: ${fazendaId}`);

    const repository = new PrismaAISuggestionRepository(prisma);
    
    // Testa busca de padrões globais para fase "Brotação 1"
    const dataInicio = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000); // 1 ano atrás
    const dataFim = new Date();
    
    const historicoGlobal = await repository.buscarPadroesGlobaisPorFase(
      fazendaId,
      'Brotação 1',
      dataInicio,
      dataFim
    );

    console.log(`Aplicações globais encontradas: ${historicoGlobal.length}`);

    return reply.send({
      sucesso: true,
      fazendaId,
      faseFenologica: 'Brotação 1',
      totalAplicacoes: historicoGlobal.length,
      aplicacoes: historicoGlobal.slice(0, 5), // Primeiras 5 para debug
      metadata: {
        timestamp: new Date().toISOString(),
        periodo: {
          inicio: dataInicio.toISOString(),
          fim: dataFim.toISOString()
        }
      }
    });

  } catch (error) {
    console.error('Erro ao testar padrões globais:', error);
    
    return reply.status(500).send({
      error: 'Erro interno do servidor',
      message: error instanceof Error ? error.message : 'Erro desconhecido',
      tipo: 'teste_global_patterns'
    });
  }
}
