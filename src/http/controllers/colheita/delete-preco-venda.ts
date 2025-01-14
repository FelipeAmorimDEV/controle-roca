import { PrismaColheitaRepository } from '@/repository/prisma/prisma-colheita-repository'
import { PrismaPrecoVendaRepository } from '@/repository/prisma/prisma-preco-venda-repository'
import { DeleteColheitaUseCase } from '@/usecases/delete-colheita-usecase'
import { DeletePrecoVendaUseCase } from '@/usecases/delete-preco-venda'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function deletePrecoVenda(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const requestParamsSchema = z.object({
    precoVendaId: z.string().uuid(),
  })

  const { precoVendaId } = requestParamsSchema.parse(request.params)

  const precoVendaRepository = new PrismaPrecoVendaRepository()
  const deletePrecoVenda = new DeletePrecoVendaUseCase(precoVendaRepository)

  await deletePrecoVenda.execute({
    precoVendaId
  })

  return reply.status(200).send()
}
