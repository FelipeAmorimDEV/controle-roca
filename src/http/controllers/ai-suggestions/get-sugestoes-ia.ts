import { FastifyRequest, FastifyReply } from 'fastify';
import { GerarSugestoesIAUsecase } from '../../../usecases/gerar-sugestoes-ia-usecase';
import { AISuggestionService } from '../../../services/ai-suggestion-service';
import { PrismaAISuggestionRepository } from '../../../repository/ai-suggestion-repository';
import { prisma } from '../../../prisma';

interface GetSugestoesIAParams {
  setorId?: string;
  fazendaId?: string;
}

interface GetSugestoesIAQuery {
  dataInicio?: string;
  dataFim?: string;
}

export async function getSugestoesIA(
  request: FastifyRequest<{
    Params: GetSugestoesIAParams;
    Querystring: GetSugestoesIAQuery;
  }>,
  reply: FastifyReply
) {
  try {
    const { setorId, fazendaId } = request.params;
    const { dataInicio, dataFim } = request.query;

    // Extrai fazendaId do token JWT se não fornecida como parâmetro
    let fazendaIdFinal = fazendaId;
    if (!fazendaId && !setorId) {
      // Tenta extrair do token JWT
      const user = (request as any).user;
      if (user && user.fazenda_id) {
        fazendaIdFinal = user.fazenda_id;
      } else {
        return reply.status(400).send({
          error: 'É necessário fornecer setorId ou fazendaId, ou estar autenticado com fazenda válida'
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

    // Inicializa dependências
    const aiSuggestionRepository = new PrismaAISuggestionRepository(prisma);
    const aiSuggestionService = new AISuggestionService();
    const gerarSugestoesIAUsecase = new GerarSugestoesIAUsecase(
      aiSuggestionService,
      aiSuggestionRepository
    );

    // Executa o use case
    const resultado = await gerarSugestoesIAUsecase.execute({
      setorId,
      fazendaId: fazendaIdFinal,
      dataInicio: dataInicioDate,
      dataFim: dataFimDate
    });

    return reply.status(200).send({
      success: true,
      data: resultado
    });

  } catch (error) {
    console.error('Erro ao gerar sugestões de IA:', error);
    return reply.status(500).send({
      error: 'Erro interno do servidor',
      message: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
}
