import { PrismaColheitaRepository } from '@/repository/prisma/prisma-colheita-repository'
import { FetchAllColheitasUseCase } from '@/usecases/fetch-all-colheitas-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function fetchColheitas(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const requestQuerySchema = z.object({
    initialDate: z.string(),
    endDate: z.string(),
    setorId: z.string().optional(),
    page: z.coerce.number(),
    perPage: z.coerce.number(),
  })

  const { perPage, initialDate, endDate, page, setorId } =
    requestQuerySchema.parse(request.query)

  const prismaColheitaRepository = new PrismaColheitaRepository()
  const fetchAllColheitasUseCase = new FetchAllColheitasUseCase(
    prismaColheitaRepository,
  )

  const { colheitas, total, totalColhido } =
    await fetchAllColheitasUseCase.execute({
      endDate,
      initialDate,
      page,
      perPage,
      setorId,
    })

  return reply.status(201).send({ colheitas, total, totalColhido })
}
