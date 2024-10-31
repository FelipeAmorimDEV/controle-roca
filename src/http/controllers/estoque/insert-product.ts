import { PrismaProductRepository } from '@/repository/prisma/prisma-product-repository'
import { PrismaStockRepository } from '@/repository/prisma/prisma-stock-repository'
import { QuantityInvalidError } from '@/usecases/errors/quantity-invalid'
import { ResouceNotFoundError } from '@/usecases/errors/resource-not-found'
import { IncrementStockUseCase } from '@/usecases/insert-stock-product-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function insertProduct(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const requestParamsSchema = z.object({
    id: z.string().uuid(),
  })
  const requestBodySchema = z.object({
    quantity: z.number(),
    createdIn: z.string(),
    valorUnidade: z.number(),
  })

  const { quantity, createdIn, valorUnidade } = requestBodySchema.parse(
    request.body,
  )
  const { id } = requestParamsSchema.parse(request.params)

  const prismaCreateProductUseCase = new PrismaProductRepository()
  const prismaStockRepository = new PrismaStockRepository()
  const insertStockProductUseCase = new IncrementStockUseCase(
    prismaCreateProductUseCase,
    prismaStockRepository,
  )

  try {
    const { withdrawLog } = await insertStockProductUseCase.execute({
      productId: id,
      quantity,
      createdIn,
      valorUnidade,
      userId: request.user.sub,
    })

    return reply.status(201).send(withdrawLog)
  } catch (error) {
    if (error instanceof QuantityInvalidError) {
      return reply.status(400).send({ message: error.message })
    }

    if (error instanceof ResouceNotFoundError) {
      return reply.status(404).send({ message: error.message })
    }

    throw error
  }
}
