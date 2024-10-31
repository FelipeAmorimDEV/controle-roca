import { PrismaColheitaRepository } from '@/repository/prisma/prisma-colheita-repository'
import { CreateColheitaUseCase } from '@/usecases/create-colheita-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function createColheita(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const requestBodySchema = z.object({
    pesoCaixa: z.coerce.number(),
    pesoTotal: z.coerce.number(),
    qntCaixa: z.coerce.number(),
    tipoCaixa: z.string(),
    setorId: z.string().uuid(),
    data: z.string(),
  })

  const { pesoCaixa, pesoTotal, qntCaixa, setorId, tipoCaixa, data } =
    requestBodySchema.parse(request.body)

  const prismaColheitaRepository = new PrismaColheitaRepository()
  const createColheitaUseCase = new CreateColheitaUseCase(
    prismaColheitaRepository,
  )

  const { colheita } = await createColheitaUseCase.execute({
    pesoCaixa,
    pesoTotal,
    qntCaixa,
    setorId,
    tipoCaixa,
    data,
  })

  return reply.status(201).send(colheita)
}
