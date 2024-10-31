import { PrismaAtividadeRepository } from '@/repository/prisma/prisma-atividade-repository'
import { FetchAtividadeUseCase } from '@/usecases/fetch-atividade-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function fetchAtividade(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const atividadeRepository = new PrismaAtividadeRepository()
  const fetchAtividades = new FetchAtividadeUseCase(atividadeRepository)

  const { atividades } = await fetchAtividades.execute()

  return reply.status(200).send(atividades)
}
