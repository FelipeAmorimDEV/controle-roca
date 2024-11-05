import { PrismaNotaFiscalRepository } from '@/repository/prisma/prisma-nota-fiscal-repository'
import { PrismaProductRepository } from '@/repository/prisma/prisma-product-repository'
import { PrismaStockRepository } from '@/repository/prisma/prisma-stock-repository'
import { DeleteNotaFiscalUseCase } from '@/usecases/delete-nota-fiscal-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function deleteNotaFiscal(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const requestParamsSchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = requestParamsSchema.parse(request.params)

  const notaFiscalRepository = new PrismaNotaFiscalRepository()
  const stockRepository = new PrismaStockRepository()
  const productRepository = new PrismaProductRepository()
  const deleteNotaFiscal = new DeleteNotaFiscalUseCase(
    notaFiscalRepository,
    stockRepository,
    productRepository,
  )

  await deleteNotaFiscal.execute({
    notaFiscalId: id,
  })

  return reply.status(200).send()
}
