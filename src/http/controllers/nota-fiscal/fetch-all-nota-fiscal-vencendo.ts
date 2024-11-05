import { PrismaNotaFiscalRepository } from '@/repository/prisma/prisma-nota-fiscal-repository'
import { FetchAllNotasFiscaisVencendoUseCase } from '@/usecases/fetch-all-notas-fiscais-vencendo'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function fetchNotasFiscaisVencendo(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const notaFiscalRepository = new PrismaNotaFiscalRepository()
  const fetchNotaFiscal = new FetchAllNotasFiscaisVencendoUseCase(
    notaFiscalRepository,
  )

  const { notasFiscais } = await fetchNotaFiscal.execute({
    fazenda_id: request.user.fazenda_id,
  })

  return reply.status(200).send({ notasFiscais })
}
