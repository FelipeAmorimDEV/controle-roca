import { PrismaFertirrigacaoRepository } from '@/repository/prisma/prisma-fertirrigacao-repository'
import { PrismaProductRepository } from '@/repository/prisma/prisma-product-repository'
import { DeleteFertirrigacaoUseCase } from '@/usecases/delete-fertirrigacao-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function deleteFertirrigacao(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const requestParamsSchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = requestParamsSchema.parse(request.params)

  const fertirrigacaoRepository = new PrismaFertirrigacaoRepository()
  const productRepository = new PrismaProductRepository()
  const deleteFertirrigacao = new DeleteFertirrigacaoUseCase(
    fertirrigacaoRepository,
    productRepository,
  )

  await deleteFertirrigacao.execute({
    fertirrigacaoId: id,
  })

  return reply.status(200).send()
}
