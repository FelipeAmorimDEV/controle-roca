import { PrismaAplicacaoRepository } from '@/repository/prisma/prisma-aplicacao-repository'
import { PrismaProductRepository } from '@/repository/prisma/prisma-product-repository'
import { PrismaStockRepository } from '@/repository/prisma/prisma-stock-repository'
import { CreateAplicacaoUseCase } from '@/usecases/create-aplicacao-usecase'
import { QuantidadeIndisponivel } from '@/usecases/errors/quantidade-indiponivel'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function createAplicacao(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const produtoListaSchema = z.object({
    produto: z.string(),
    dosagem: z.coerce.number(),
    total: z.coerce.number(),
  })
  const requestBodySchema = z.object({
    aplicador: z.string(),
    volumeCalda: z.coerce.number(),
    setorId: z.string().uuid(),
    produtosAplicados: z.array(produtoListaSchema),
  })

  const { aplicador, produtosAplicados, setorId, volumeCalda } =
    requestBodySchema.parse(request.body)

  const prismaAplicacaoRepository = new PrismaAplicacaoRepository()
  const prismaStockRepository = new PrismaStockRepository()
  const prismaProductRepository = new PrismaProductRepository()
  const createAplicacaoUsecase = new CreateAplicacaoUseCase(
    prismaAplicacaoRepository,
    prismaStockRepository,
    prismaProductRepository,
  )

  try {
    const { aplicacao } = await createAplicacaoUsecase.execute({
      aplicador,
      produtos: produtosAplicados,
      setorId,
      volumeCalda,
      userId: request.user.sub,
    })

    return reply.status(201).send(aplicacao)
  } catch (error) {
    if (error instanceof QuantidadeIndisponivel) {
      return reply.status(409).send({ message: error.message })
    }

    throw error
  }
}
