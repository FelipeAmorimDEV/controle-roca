import { PrismaAplicacaoRepository } from '@/repository/prisma/prisma-aplicacao-repository'
import { PrismaProductRepository } from '@/repository/prisma/prisma-product-repository'
import { DeleteAplicacaoUseCase } from '@/usecases/delete-aplicacao-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function deleteAplicacao(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const requestParamsSchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = requestParamsSchema.parse(request.params)

  const aplicacaoRepository = new PrismaAplicacaoRepository()
  const productRepository = new PrismaProductRepository()
  const deleteAplicacao = new DeleteAplicacaoUseCase(
    aplicacaoRepository,
    productRepository,
  )

  await deleteAplicacao.execute({
    aplicacaoId: id,
  })

  return reply.status(200).send()
}
