import { PrismaProductRepository } from '@/repository/prisma/prisma-product-repository'
import { PrismaStockRepository } from '@/repository/prisma/prisma-stock-repository'
import { DeleteEntradaUseCase } from '@/usecases/delete-entrada-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function deleteEntrada(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const requestParamsSchema = z.object({
    entradaId: z.string().uuid(),
  })

  const { entradaId } = requestParamsSchema.parse(request.params)

  const prismaCreateProductUseCase = new PrismaProductRepository()
  const prismaStockRepository = new PrismaStockRepository()
  const deleteEntradaUseCase = new DeleteEntradaUseCase(
    prismaCreateProductUseCase,
    prismaStockRepository,
  )

  await deleteEntradaUseCase.execute({
    entradaId,
    fazenda_id: request.user.fazenda_id,
  })

  return reply.status(200).send()
}
