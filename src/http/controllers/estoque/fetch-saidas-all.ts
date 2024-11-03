import { PrismaStockRepository } from '@/repository/prisma/prisma-stock-repository'
import { FetchTodasSaidasUseCase } from '@/usecases/fetch-todas-saidas-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function fetchSaidasAll(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const requestQuerySchema = z.object({
    productId: z.string().optional(),
    setorId: z.string().optional(),
    initialDate: z.string(),
    endDate: z.string(),
    page: z.coerce.number(),
    perPage: z.coerce.number(),
  })

  const { productId, setorId, initialDate, endDate, page, perPage } =
    requestQuerySchema.parse(request.query)

  const prismaStockRepository = new PrismaStockRepository()
  const fetchAllEntradas = new FetchTodasSaidasUseCase(prismaStockRepository)

  const { saidas, total, saidasTotal } = await fetchAllEntradas.execute({
    productId,
    setorId,
    initialDate,
    endDate,
    page,
    perPage,
    fazenda_id: request.user.fazenda_id,
  })

  return reply.status(200).send({ saidas, total, saidasTotal })
}
