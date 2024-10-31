import { PrismTratoristaRepository } from '@/repository/prisma/prisma-tratorista-repository'
import { CreateTratoristaUseCase } from '@/usecases/create-tratorista-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function createTratorista(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const requestBodySchema = z.object({
    name: z.string(),
  })

  const { name } = requestBodySchema.parse(request.body)

  const prismaTratorista = new PrismTratoristaRepository()
  const createTratorista = new CreateTratoristaUseCase(prismaTratorista)

  const { tratorista } = await createTratorista.execute({
    name: name.toUpperCase(),
  })

  return reply.status(201).send(tratorista)
}
