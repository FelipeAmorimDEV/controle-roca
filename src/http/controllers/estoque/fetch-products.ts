import { PrismaProductRepository } from '@/repository/prisma/prisma-product-repository'
import { FetchAllProductsUseCase } from '@/usecases/fetch-all-product-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function fetchProducts(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const requestQuerySchema = z.object({
    q: z.string().optional(),
    page: z.coerce.number(),
    all: z.coerce.boolean().optional(),
    perPage: z.coerce.number(),
  })

  const { q, page, all, perPage } = requestQuerySchema.parse(request.query)

  const prismaCreateProductUseCase = new PrismaProductRepository()
  const fetchAllProductsUseCase = new FetchAllProductsUseCase(
    prismaCreateProductUseCase,
  )

  const { products, total, totalEstoque } =
    await fetchAllProductsUseCase.execute({
      q,
      page,
      all,
      perPage,
      fazenda_id: request.user.fazenda_id,
    })

  return reply.status(200).send({ products, total, totalEstoque })
}
