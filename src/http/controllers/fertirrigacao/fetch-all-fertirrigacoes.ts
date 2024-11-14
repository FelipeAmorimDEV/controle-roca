import { PrismaFertirrigacaoRepository } from '@/repository/prisma/prisma-fertirrigacao-repository'
import { FetchAllFertirrigacoesUseCase } from '@/usecases/fetch-all-fertirrigacao-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function fetchAllFertirrigacoes(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const requestQuerySchema = z.object({
    page: z.coerce.number(),
    perPage: z.coerce.number(),
    initialDate: z.string(),
    endDate: z.string(),
    setorId: z.string().uuid().optional(),
  })

  const { endDate, initialDate, page, perPage, setorId } =
    requestQuerySchema.parse(request.query)

  const fertirrigacoesRepository = new PrismaFertirrigacaoRepository()
  const fetchAllFertirrigacoes = new FetchAllFertirrigacoesUseCase(
    fertirrigacoesRepository,
  )

  const { fertirrigacoes } = await fetchAllFertirrigacoes.execute({
    fazenda_id: request.user.fazenda_id,
    endDate,
    initialDate,
    page,
    perPage,
    setorId,
  })

  return reply.status(200).send(fertirrigacoes)
}
