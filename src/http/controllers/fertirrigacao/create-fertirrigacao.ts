import { PrismaFertirrigacaoRepository } from '@/repository/prisma/prisma-fertirrigacao-repository'
import { PrismaProductRepository } from '@/repository/prisma/prisma-product-repository'
import { PrismaStockRepository } from '@/repository/prisma/prisma-stock-repository'
import { CreateFertirrigacaoUseCase } from '@/usecases/create-fertirrigacao-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function createFertirrigacao(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const requestBodySchema = z.object({
    aplicadorId: z.string().uuid(),
    setorId: z.string().uuid(),
    semana: z.string(),
    produtos: z.array(
      z.object({
        produtoId: z.string(),
        quantidade: z.coerce.number(),
      }),
    ),
  })

  const { aplicadorId, produtos, setorId, semana } = requestBodySchema.parse(
    request.body,
  )

  const fertirrigacaoRepository = new PrismaFertirrigacaoRepository()
  const productRepository = new PrismaProductRepository()
  const stockRepository = new PrismaStockRepository()
  const createFertirrigacao = new CreateFertirrigacaoUseCase(
    fertirrigacaoRepository,
    productRepository,
    stockRepository,
  )

  const { fertirrigacao } = await createFertirrigacao.execute({
    fazenda_id: request.user.fazenda_id,
    aplicadorId,
    produtos,
    setorId,
    semana,
    user_id: request.user.sub,
  })

  return reply.status(201).send(fertirrigacao)
}
