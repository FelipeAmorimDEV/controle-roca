import { PrismaFornecedorRepository } from '@/repository/prisma/prisma-fornecedor-repository'
import { CreateFornecedorUseCase } from '@/usecases/create-fornecedor-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function createFornecedor(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const requestBodySchema = z.object({
    name: z.string(),
  })

  const { name } = requestBodySchema.parse(request.body)

  const prismaFornecedor = new PrismaFornecedorRepository()
  const createFornecedor = new CreateFornecedorUseCase(prismaFornecedor)

  const { fornecedor } = await createFornecedor.execute({
    name: name.toUpperCase(),
    fazenda_id: request.user.fazenda_id,
  })

  return reply.status(201).send(fornecedor)
}
