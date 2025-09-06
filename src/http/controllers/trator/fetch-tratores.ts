import { PrismaTratorRepository } from '@/repository/prisma/prisma-trator-repository'
import { FetchTratoresUseCase } from '@/usecases/fetch-tratores-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function fetchTratores(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const tratorRepository = new PrismaTratorRepository()
  const fetchTratoresUseCase = new FetchTratoresUseCase(tratorRepository)

  const { tratores, totalTratores } = await fetchTratoresUseCase.execute({
    fazenda_id: request.user.fazenda_id,
  })

  return reply.status(200).send({
    success: true,
    tratores,
    totalTratores,
  })
}