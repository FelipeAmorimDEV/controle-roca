import { PrismaColheitaRepository } from '@/repository/prisma/prisma-colheita-repository'
import { AtualizaPrecoColheitaUseCase } from '@/usecases/atualiza-preco-colheita-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function atualizaPrecoColheita(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const colheitaRepository = new PrismaColheitaRepository()
  const atualizaPrecoColheita = new AtualizaPrecoColheitaUseCase(
    colheitaRepository,
  )

  await atualizaPrecoColheita.execute({
    fazenda_id: request.user.fazenda_id,
  })

  return reply.status(201).send({ message: 'Colheitas atualizadas.' })
}
