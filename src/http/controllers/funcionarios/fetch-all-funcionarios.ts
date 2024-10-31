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

  try {
    const { funcionarios } = await fetchAllFuncionariosUseCase.execute({})

    return reply.status(201).send(funcionarios)
  } catch (error) {
    throw error
  }
}
