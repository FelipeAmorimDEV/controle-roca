import { PrismaSetorRepository } from '@/repository/prisma/prisma-setor-repository'
import { FetchAllApontamentoLoteUseCase } from '@/usecases/fetch-all-apontamentos-lote'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function fetchApontamentosSetor(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const requestQuerySchema = z.object({
    initialDate: z.string(),
    endDate: z.string(),
    setorId: z.string().optional(),
    atividadeId: z.string().optional(),
    page: z.coerce.number(),
    perPage: z.coerce.number(),
  })

  const { initialDate, endDate, page, perPage, atividadeId, setorId } =
    requestQuerySchema.parse(request.query)

  const prismaSetorRepository = new PrismaSetorRepository()
  const fetchApontamentos = new FetchAllApontamentoLoteUseCase(
    prismaSetorRepository,
  )

  const { apontamentos, total } = await fetchApontamentos.execute({
    fazenda_id: request.user.fazenda_id,
    endDate,
    initialDate,
    page,
    perPage,
    atividadeId,
    setorId,
  })

  return reply.status(200).send({ apontamentos, total })
}
