import { PrismaFuncionarioRepository } from '@/repository/prisma/prisma-funcionaro-repository'
import { FetchAllFuncionariosUseCase } from '@/usecases/fetch-all-funcionarios-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function fetchAllFuncionarios(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const prismaFuncionarioRepository = new PrismaFuncionarioRepository()
  const fetchAllFuncionariosUseCase = new FetchAllFuncionariosUseCase(
    prismaFuncionarioRepository,
  )
  const { funcionarios } = await fetchAllFuncionariosUseCase.execute()

  return reply.status(200).send(funcionarios)
}
