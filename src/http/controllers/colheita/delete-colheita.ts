import { PrismaColheitaRepository } from '@/repository/prisma/prisma-colheita-repository'
import { DeleteColheitaUseCase } from '@/usecases/delete-colheita-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function deleteColheita(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const requestParamsSchema = z.object({
    colheitaId: z.string().uuid(),
  })

  const { colheitaId } = requestParamsSchema.parse(request.params)

  const prismaColheitaRepository = new PrismaColheitaRepository()
  const deleteColheita = new DeleteColheitaUseCase(prismaColheitaRepository)

  await deleteColheita.execute({
    colheitaId,
  })

  return reply.status(200).send()
}
