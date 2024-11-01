import { PrismaProductRepository } from '@/repository/prisma/prisma-product-repository'
import { PrismaStockRepository } from '@/repository/prisma/prisma-stock-repository'
import { DeleteProductUseCase } from '@/usecases/delete-product-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function deleteProduct(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const requestParamsSchema = z.object({
    productId: z.string().uuid(),
  })

  const { productId } = requestParamsSchema.parse(request.params)

  const productRepository = new PrismaProductRepository()
  const stockRepository = new PrismaStockRepository()
  const deleteProduct = new DeleteProductUseCase(
    productRepository,
    stockRepository,
  )

  await deleteProduct.execute({
    productId,
  })

  return reply.status(200).send()
}
