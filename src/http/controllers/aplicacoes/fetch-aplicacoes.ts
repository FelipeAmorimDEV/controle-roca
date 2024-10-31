import { PrismaAplicacaoRepository } from '@/repository/prisma/prisma-aplicacao-repository'
import { FetchAllAplicacoesUseCase } from '@/usecases/fetch-all-aplicacoes'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function fetchAplicacoes(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const prismaAplicacoesRepository = new PrismaAplicacaoRepository()
  const fetchAllAplicacoes = new FetchAllAplicacoesUseCase(
    prismaAplicacoesRepository,
  )

  const { aplicacoes } = await fetchAllAplicacoes.execute()

  return reply.status(201).send({ aplicacoes })
}
