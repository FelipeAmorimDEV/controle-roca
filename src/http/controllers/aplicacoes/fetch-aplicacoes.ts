import { PrismaAplicacaoRepository } from '@/repository/prisma/prisma-aplicacao-repository'
import { FetchAllAplicacoesUseCase } from '@/usecases/fetch-all-aplicacoes'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function fetchAplicacoes(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const requestQuerySchema = z.object({
    initialDate: z.string(),
    endDate: z.string(),
    page: z.coerce.number(),
    perPage: z.coerce.number(),
    setorId: z.string().uuid().optional(),
  })

  const { initialDate, endDate, page, perPage, setorId } =
    requestQuerySchema.parse(request.query)

  const prismaAplicacoesRepository = new PrismaAplicacaoRepository()
  const fetchAllAplicacoes = new FetchAllAplicacoesUseCase(
    prismaAplicacoesRepository,
  )

  const { aplicacoes, totalAplicacoes } = await fetchAllAplicacoes.execute({
    fazenda_id: request.user.fazenda_id,
    endDate,
    initialDate,
    page,
    perPage,
    setorId,
  })

  return reply.status(200).send({ aplicacoes, totalAplicacoes })
}
