import { PrismaCaixaRepository } from '@/repository/prisma/prisma-caixa-repository'
import { FetchAllCaixasUseCase } from '@/usecases/fetch-all-caixas-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function fetchCaixas(
  request: FastifyRequest,
  reply: FastifyReply,
) {
 

  const prismaCaixaRepository = new PrismaCaixaRepository()
  const fetchAllCaixaUseCase = new FetchAllCaixasUseCase(
    prismaCaixaRepository,
  )

  try {
    const { caixas } = await fetchAllCaixaUseCase.execute({})
    return reply.status(201).send(caixas)
  } catch (error) {
    throw error
  }
}
