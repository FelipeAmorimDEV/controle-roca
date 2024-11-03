import { PrismTratoristaRepository } from '@/repository/prisma/prisma-tratorista-repository'
import { FetchAllTratoristaUseCase } from '@/usecases/fetch-all-tratorista'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function fetchTratoristas(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const prismaTratoristaRepository = new PrismTratoristaRepository()
  const fetchAllTratoristaUseCase = new FetchAllTratoristaUseCase(
    prismaTratoristaRepository,
  )

  const { tratoristas } = await fetchAllTratoristaUseCase.execute()

  return reply.status(200).send(tratoristas)
}
