import { PrismaProductRepository } from '@/repository/prisma/prisma-product-repository'
import { CreateProductUseCase } from '@/usecases/create-product-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function createProduct(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const requestBodySchema = z.object({
    name: z.string(),
    unit: z.enum(['l', 'kg', 'ud']),
    tipoId: z.string().uuid(),
  })

  const { name, unit, tipoId } = requestBodySchema.parse(request.body)

  const prismaCreateProductUseCase = new PrismaProductRepository()
  const createProductUseCase = new CreateProductUseCase(
    prismaCreateProductUseCase,
  )

  const { product } = await createProductUseCase.execute({
    name: name.toUpperCase(),
    unit,
    tipoId,
    fazenda_id: request.user.fazenda_id,
  })

  return reply.status(201).send(product)
}
