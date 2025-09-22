import { FastifyRequest, FastifyReply } from 'fastify';
import { GerarSugestoesIAUsecase } from '../../../usecases/gerar-sugestoes-ia-usecase';
import { AISuggestionService } from '../../../services/ai-suggestion-service';
import { PrismaAISuggestionRepository } from '../../../repository/ai-suggestion-repository';
import { prisma } from '../../../prisma';

export async function testSugestoesGlobais(
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

    console.log('Testando geração de sugestões globais...');
    console.log(`FazendaId: ${fazendaId}`);

    // Inicializa serviços
    const aiSuggestionRepository = new PrismaAISuggestionRepository(prisma);
    const aiSuggestionService = new AISuggestionService();
    const gerarSugestoesIAUsecase = new GerarSugestoesIAUsecase(
      aiSuggestionService,
      aiSuggestionRepository
    );

    // Testa análise global
    const resultado = await gerarSugestoesIAUsecase.executeGlobal({
      fazendaId,
      dataInicio: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), // 1 ano atrás
      dataFim: new Date()
    });

    console.log(`Análise global concluída: ${resultado.sugestoes.length} sugestões geradas`);

    return reply.send({
      sucesso: true,
      tipo: 'teste_sugestoes_globais',
      dados: resultado,
      metadata: {
        timestamp: new Date().toISOString(),
        totalSetores: resultado.estatisticas.totalSetores,
        setoresComSugestoes: resultado.estatisticas.setoresComSugestoes,
        confiabilidadeMedia: resultado.estatisticas.confiabilidadeMedia
      }
    });

  } catch (error) {
    console.error('Erro ao testar sugestões globais:', error);
    
    return reply.status(500).send({
      error: 'Erro interno do servidor',
      message: error instanceof Error ? error.message : 'Erro desconhecido',
      tipo: 'teste_sugestoes_globais'
    });
  }
}
