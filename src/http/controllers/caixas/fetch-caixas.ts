import { PrismaCaixaRepository } from '@/repository/prisma/prisma-caixa-repository'
import { FetchAllCaixasUseCase } from '@/usecases/fetch-all-caixas-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function fetchCaixas(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const prismaCaixaRepository = new PrismaCaixaRepository()
  const fetchAllCaixaUseCase = new FetchAllCaixasUseCase(prismaCaixaRepository)

  const { caixas } = await fetchAllCaixaUseCase.execute({
    fazenda_id: request.user.fazenda_id,
  })
  return reply.status(200).send(caixas)
}
