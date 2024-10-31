import { PrismaFornecedorRepository } from '@/repository/prisma/prisma-fornecedor-repository'
import { FetchAllFornecedoresUseCase } from '@/usecases/fetch-all-fornecedores-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function fetchFornecedor(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const prismaFornecedorRepository = new PrismaFornecedorRepository()
  const fetchAllFornecedoresUseCase = new FetchAllFornecedoresUseCase(
    prismaFornecedorRepository,
  )

  const { fornecedores } = await fetchAllFornecedoresUseCase.execute()

  return reply.status(201).send(fornecedores)
}
