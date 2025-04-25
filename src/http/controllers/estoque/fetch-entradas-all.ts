import { PrismaStockRepository } from '@/repository/prisma/prisma-stock-repository'
import { FetchTodasEntradasUseCase } from '@/usecases/fetch-todas-entradas-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function fetchEntradasAll(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const requestQuerySchema = z.object({
    initialDate: z.string(),
    endDate: z.string(),
    productName: z.string().optional(),
    page: z.coerce.number(),
    perPage: z.coerce.number(),
  })

  const { productName, initialDate, endDate, page, perPage } =
    requestQuerySchema.parse(request.query)

  const prismaStockRepository = new PrismaStockRepository()
  const fetchAllEntradas = new FetchTodasEntradasUseCase(prismaStockRepository)

  const { entradas, total, entradasTotal } = await fetchAllEntradas.execute({
    initialDate,
    endDate,
    productName,
    page,
    perPage,
    fazenda_id: request.user.fazenda_id,
  })

  return reply.status(200).send({ entradas, total, entradasTotal })
}
