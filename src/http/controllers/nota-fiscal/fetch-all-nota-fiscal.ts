import { PrismaNotaFiscalRepository } from '@/repository/prisma/prisma-nota-fiscal-repository'
import { FetchAllNotasFiscaisUseCase } from '@/usecases/fetch-all-notas-fiscais-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function fetchNotasFiscais(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const requestQuerySchema = z.object({
    page: z.coerce.number(),
    perPage: z.coerce.number(),
    initialDate: z.string(),
    endDate: z.string(),
    status: z.enum(['pago', 'pendente']).optional(),
    fornecedorId: z.string().uuid().optional(),
  })

  const { endDate, initialDate, page, perPage, fornecedorId, status } =
    requestQuerySchema.parse(request.query)

  const notaFiscalRepository = new PrismaNotaFiscalRepository()
  const fetchNotaFiscal = new FetchAllNotasFiscaisUseCase(notaFiscalRepository)

  const { notasFiscais, total } = await fetchNotaFiscal.execute({
    fazenda_id: request.user.fazenda_id,
    endDate,
    initialDate,
    page,
    perPage,
    fornecedorId,
    status,
  })

  return reply.status(200).send({ notasFiscais, total })
}
