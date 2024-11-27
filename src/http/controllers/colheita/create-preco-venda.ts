import { PrismaPrecoVendaRepository } from '@/repository/prisma/prisma-preco-venda-repository'
import { CreatePrecoVendaUseCase } from '@/usecases/create-preco-venda-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function createPrecoVenda(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const requestBodySchema = z.object({
    classificacao: z.string(),
    preco: z.coerce.number(),
    dataInicio: z.string(),
    dataFim: z.string(),
  })

  const { classificacao, dataFim, dataInicio, preco } = requestBodySchema.parse(
    request.body,
  )

  const precoVendaRepository = new PrismaPrecoVendaRepository()
  const createPrecoVenda = new CreatePrecoVendaUseCase(precoVendaRepository)

  const { precoVenda } = await createPrecoVenda.execute({
    classificacao,
    dataFim,
    dataInicio,
    preco,
    fazenda_id: request.user.fazenda_id,
  })

  return reply.status(201).send(precoVenda)
}
