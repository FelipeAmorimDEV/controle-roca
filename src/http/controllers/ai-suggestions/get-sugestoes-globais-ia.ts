import { FastifyRequest, FastifyReply } from 'fastify';
import { GerarSugestoesIAUsecase } from '../../../usecases/gerar-sugestoes-ia-usecase';
import { AISuggestionService } from '../../../services/ai-suggestion-service';
import { PrismaAISuggestionRepository } from '../../../repository/ai-suggestion-repository';
import { prisma } from '../../../prisma';

interface GetSugestoesGlobaisIAParams {
  setorId?: string;
}

interface GetSugestoesGlobaisIAQuery {
  fazendaId?: string;
  dataInicio?: string;
  dataFim?: string;
}

export async function getSugestoesGlobaisIA(
  request: FastifyRequest<{
    Params: GetSugestoesGlobaisIAParams;
    Querystring: GetSugestoesGlobaisIAQuery;
  }>,
  reply: FastifyReply
) {
  try {
    const { setorId: setorIdParam } = request.params;
    const { setorId: setorIdQuery, fazendaId, dataInicio, dataFim } = request.query;
    
    const setorId = setorIdParam || setorIdQuery;
    
    // Extrai fazendaId do token se não fornecido
    const fazendaIdFinal = fazendaId || (request as any).user?.fazenda_id;
    
    if (!fazendaIdFinal) {
      return reply.status(400).send({
        error: 'FazendaId é obrigatório para análise global'
      });
    }

    console.log('Parâmetros recebidos para análise global:', {
      setorId,
      fazendaId: fazendaIdFinal,
      dataInicio,
      dataFim
    });

    // Converte datas se fornecidas
    const dataInicioFinal = dataInicio ? new Date(dataInicio) : undefined;
    const dataFimFinal = dataFim ? new Date(dataFim) : undefined;

    // Inicializa serviços
    const aiSuggestionRepository = new PrismaAISuggestionRepository(prisma);
    const aiSuggestionService = new AISuggestionService();
    const gerarSugestoesIAUsecase = new GerarSugestoesIAUsecase(
      aiSuggestionService,
      aiSuggestionRepository
    );

    // Executa análise global
    const resultado = await gerarSugestoesIAUsecase.executeGlobal({
      setorId,
      fazendaId: fazendaIdFinal,
      dataInicio: dataInicioFinal,
      dataFim: dataFimFinal
    });

    console.log(`Análise global concluída: ${resultado.sugestoes.length} sugestões geradas`);

    return reply.send({
      sucesso: true,
      tipo: 'analise_global',
      dados: resultado,
      metadata: {
        timestamp: new Date().toISOString(),
        setorEspecifico: !!setorId,
        totalSetores: resultado.estatisticas.totalSetores,
        setoresComSugestoes: resultado.estatisticas.setoresComSugestoes
      }
    });

  } catch (error) {
    console.error('Erro ao gerar sugestões globais:', error);
    
    return reply.status(500).send({
      error: 'Erro interno do servidor',
      message: error instanceof Error ? error.message : 'Erro desconhecido',
      tipo: 'analise_global'
    });
  }
}
