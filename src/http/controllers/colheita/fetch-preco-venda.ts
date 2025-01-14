import { PrismaPrecoVendaRepository } from '@/repository/prisma/prisma-preco-venda-repository'
import { FetchPrecoVendaUseCase } from '@/usecases/fetch-preco-venda-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function fetchPrecoVenda(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const precoVendaRepository = new PrismaPrecoVendaRepository()
  const fetchPrecoVenda = new FetchPrecoVendaUseCase(
    precoVendaRepository,
  )

  const { precosVenda } = await fetchPrecoVenda.execute({
    fazenda_id: request.user.fazenda_id,
  })

  return reply.status(201).send({ precosVenda })
}
