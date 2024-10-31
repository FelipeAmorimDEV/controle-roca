import { PrismaSetorRepository } from '@/repository/prisma/prisma-setor-repository'
import { FetchAllSetorUseCase } from '@/usecases/fetch-all-setor-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function fetchSetores(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const prismaSetorRepository = new PrismaSetorRepository()
  const fetchAllSetorUseCase = new FetchAllSetorUseCase(prismaSetorRepository)

  const { setores } = await fetchAllSetorUseCase.execute()

  return reply.status(201).send(setores)
}
