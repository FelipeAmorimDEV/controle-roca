import { PrismaRentabilidadeRepository } from '@/repository/prisma/prisma-rentabilidade-repository'
import { GetRelatorioRentabilidadeUseCase } from '@/usecases/get-relatorio-rentabilidade-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function getRelatorioRentabilidade(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const requestQuerySchema = z.object({
    initialDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD'),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD'),
    setorId: z.string().uuid().optional(),
  })

  const { initialDate, endDate, setorId } = requestQuerySchema.parse(request.query)

  // Validar se a data inicial é anterior à data final
  if (new Date(initialDate) > new Date(endDate)) {
    return reply.status(400).send({
      message: 'Data inicial deve ser anterior à data final'
    })
  }

  const rentabilidadeRepository = new PrismaRentabilidadeRepository()
  const getRelatorioRentabilidadeUseCase = new GetRelatorioRentabilidadeUseCase(
    rentabilidadeRepository
  )

  try {
    const relatorio = await getRelatorioRentabilidadeUseCase.execute({
      fazenda_id: request.user.fazenda_id,
      initialDate,
      endDate,
      setorId,
    })

    return reply.status(200).send({
      success: true,
      message: 'Relatório de rentabilidade gerado com sucesso',
      data: relatorio,
      periodo: {
        inicial: initialDate,
        final: endDate,
        dias: Math.ceil((new Date(endDate).getTime() - new Date(initialDate).getTime()) / (1000 * 60 * 60 * 24))
      }
    })
  } catch (error) {
    console.error('Erro ao gerar relatório de rentabilidade:', error)
    return reply.status(500).send({
      message: 'Erro interno do servidor ao gerar relatório',
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    })
  }
}
