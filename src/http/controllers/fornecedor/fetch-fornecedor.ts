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

  const { fornecedores } = await fetchAllFornecedoresUseCase.execute({
    fazenda_id: request.user.fazenda_id,
  })

  return reply.status(200).send(fornecedores)
}
