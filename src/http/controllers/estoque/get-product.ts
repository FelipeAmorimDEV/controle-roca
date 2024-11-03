import { PrismaProductRepository } from '@/repository/prisma/prisma-product-repository'
import { ResouceNotFoundError } from '@/usecases/errors/resource-not-found'
import { FindProductUsecase } from '@/usecases/find-product-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function getProducts(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const requestParamsSchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = requestParamsSchema.parse(request.params)

  const prismaCreateProductUseCase = new PrismaProductRepository()
  const findProductUseCase = new FindProductUsecase(prismaCreateProductUseCase)

  try {
    const { product } = await findProductUseCase.execute({
      id,
      fazenda_id: request.user.fazenda_id,
    })

    return reply.status(200).send(product)
  } catch (error) {
    if (error instanceof ResouceNotFoundError) {
      return reply.status(404).send({
        message: error.message,
      })
    }
  }
}
