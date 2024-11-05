import { PrismaNotaFiscalRepository } from '@/repository/prisma/prisma-nota-fiscal-repository'
import { MarkNotaFiscalPagaUseCase } from '@/usecases/mark-nota-fiscal-paga-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function markNotaFiscalPaga(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const requestParamsSchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = requestParamsSchema.parse(request.params)

  const notaFiscalRepository = new PrismaNotaFiscalRepository()
  const markNotaFiscalPaga = new MarkNotaFiscalPagaUseCase(notaFiscalRepository)

  await markNotaFiscalPaga.execute({
    notaFiscalId: id,
  })

  return reply.status(200).send()
}
