import { PrismaManutencaoRepository } from '@/repository/prisma/prisma-manutencao-repository'
import { GetRelatorioCustosUseCase } from '@/usecases/get-relatorio-custos-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function getRelatorioCustos(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const requestParamsSchema = z.object({
    tratarId: z.string().uuid(),
  })

  const requestQuerySchema = z.object({
    dataInicial: z.string().optional(),
    dataFinal: z.string().optional(),
  })

  const { tratarId } = requestParamsSchema.parse(request.params)
  const { dataInicial, dataFinal } = requestQuerySchema.parse(request.query)

  const manutencaoRepository = new PrismaManutencaoRepository()
  const getRelatorioCustosUseCase = new GetRelatorioCustosUseCase(manutencaoRepository)

  const relatorio = await getRelatorioCustosUseCase.execute({
    tratarId,
    fazenda_id: request.user.fazenda_id,
    dataInicial,
    dataFinal,
  })

  return reply.status(200).send({
    success: true,
    relatorio,
  })
}