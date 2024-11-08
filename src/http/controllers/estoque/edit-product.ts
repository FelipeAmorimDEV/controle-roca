import { PrismaProductRepository } from '@/repository/prisma/prisma-product-repository'
import { CreateProductUseCase } from '@/usecases/create-product-usecase'
import { EditProductUseCase } from '@/usecases/edit-product-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function editProduto(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const requestBodySchema = z.object({
    name: z.string(),
    unit: z.enum(['l', 'kg', 'ud']),
    tipoId: z.string().uuid(),
  })

  const requestParamsSchema = z.object({
    id: z.string().uuid(),
  })

  const { name, unit, tipoId } = requestBodySchema.parse(request.body)
  const { id } = requestParamsSchema.parse(request.params)
  const prismaCreateProductUseCase = new PrismaProductRepository()
  const updateProduto = new EditProductUseCase(prismaCreateProductUseCase)

  await updateProduto.execute({
    name: name.toUpperCase(),
    unit,
    tipoId,
    productId: id,
  })

  return reply.status(200).send()
}
