import { PrismaProductRepository } from '@/repository/prisma/prisma-product-repository'
import { PrismaStockRepository } from '@/repository/prisma/prisma-stock-repository'
import { DeleteSaidaUseCase } from '@/usecases/delete-saida-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function deleteSaida(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const requestParamsSchema = z.object({
    saidaId: z.string().uuid(),
  })

  const { saidaId } = requestParamsSchema.parse(request.params)

  const prismaCreateProductUseCase = new PrismaProductRepository()
  const prismaStockRepository = new PrismaStockRepository()
  const deleteSaida = new DeleteSaidaUseCase(
    prismaCreateProductUseCase,
    prismaStockRepository,
  )

  await deleteSaida.execute({
    saidaId,
    fazenda_id: request.user.fazenda_id,
  })

  return reply.status(200).send()
}
