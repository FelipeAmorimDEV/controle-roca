import { PrismaApontamentoRepository } from '@/repository/prisma/prisma-apontamento-repository'
import { DeleteApontamentoUseCase } from '@/usecases/delete-apontamento-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function deleteApontamento(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const requestParamsSchema = z.object({
    apontamentoId: z.string().uuid(),
  })

  const { apontamentoId } = requestParamsSchema.parse(request.params)

  const apontamentoRepository = new PrismaApontamentoRepository()
  const deleteApontamento = new DeleteApontamentoUseCase(apontamentoRepository)

  const { apontamento } = await deleteApontamento.execute({
    apontamentoId,
  })

  return reply.status(200).send(apontamento)
}
