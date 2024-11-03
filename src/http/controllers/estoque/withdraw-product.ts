import { PrismaProductRepository } from '@/repository/prisma/prisma-product-repository'
import { PrismaStockRepository } from '@/repository/prisma/prisma-stock-repository'
import { QuantityInvalidError } from '@/usecases/errors/quantity-invalid'
import { QuantityUnavailableError } from '@/usecases/errors/quantity-unavailable'
import { ResouceNotFoundError } from '@/usecases/errors/resource-not-found'
import { WithdrawStockUseCase } from '@/usecases/withdraw-stock-product-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function withdrawProduct(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const requestParamsSchema = z.object({
    id: z.string().uuid(),
  })
  const requestBodySchema = z.object({
    quantity: z.number(),
    setorId: z.string().uuid(),
    createdIn: z.string(),
  })

  const { quantity, setorId, createdIn } = requestBodySchema.parse(request.body)
  const { id } = requestParamsSchema.parse(request.params)

  const prismaCreateProductUseCase = new PrismaProductRepository()
  const prismaStockRepository = new PrismaStockRepository()
  const decrementStockProductUseCase = new WithdrawStockUseCase(
    prismaCreateProductUseCase,
    prismaStockRepository,
  )

  try {
    const { produtoAtualizado } = await decrementStockProductUseCase.execute({
      productId: id,
      quantity,
      setorId,
      createdIn,
      userId: request.user.sub,
      fazenda_id: request.user.fazenda_id,
    })

    return reply.status(201).send(produtoAtualizado)
  } catch (error) {
    if (error instanceof QuantityInvalidError) {
      return reply.status(400).send({ message: error.message })
    }

    if (error instanceof ResouceNotFoundError) {
      return reply.status(404).send({ message: error.message })
    }

    if (error instanceof QuantityUnavailableError) {
      return reply.status(400).send({ message: error.message })
    }

    throw error
  }
}
