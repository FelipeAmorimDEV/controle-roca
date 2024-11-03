import { PrismaTipoRepository } from '@/repository/prisma/prisma-tipo-repository'
import { FetchAllTiposUseCase } from '@/usecases/fetch-all-tipos-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function fetchTipos(request: FastifyRequest, reply: FastifyReply) {
  const prismaTiposRepository = new PrismaTipoRepository()
  const fetchAllTiposUseCase = new FetchAllTiposUseCase(prismaTiposRepository)

  const { tipos } = await fetchAllTiposUseCase.execute()

  return reply.status(200).send(tipos)
}
