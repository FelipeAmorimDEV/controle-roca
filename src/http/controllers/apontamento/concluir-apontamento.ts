import { PrismaApontamentoRepository } from '@/repository/prisma/prisma-apontamento-repository'
import { ConcluirApontamentoUseCase } from '@/usecases/concluir-apontamento-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function concluirApontamento(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const requestParamsSchema = z.object({
    apontamentoId: z.string().uuid(),
  })

  const { apontamentoId } = requestParamsSchema.parse(request.params)

  const apontamentoRepository = new PrismaApontamentoRepository()
  const createApontamento = new ConcluirApontamentoUseCase(
    apontamentoRepository,
  )

  const { apontamento } = await createApontamento.execute({
    apontamentoId,
    fazenda_id: request.user.fazenda_id,
  })

  return reply.status(200).send(apontamento)
}
