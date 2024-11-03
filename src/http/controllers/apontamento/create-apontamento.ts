import { PrismaApontamentoRepository } from '@/repository/prisma/prisma-apontamento-repository'
import { CreateApontamentoUseCase } from '@/usecases/create-apontamento-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function createApontamento(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const requestBodySchema = z.object({
    funcionarioId: z.string().uuid(),
    setorId: z.string().uuid(),
    atividadeId: z.string().uuid(),
  })

  const { atividadeId, funcionarioId, setorId } = requestBodySchema.parse(
    request.body,
  )

  const apontamentoRepository = new PrismaApontamentoRepository()
  const createApontamento = new CreateApontamentoUseCase(apontamentoRepository)

  const { apontamento } = await createApontamento.execute({
    atividadeId,
    funcionarioId,
    setorId,
    fazenda_id: request.user.fazenda_id,
  })

  return reply.status(201).send(apontamento)
}
