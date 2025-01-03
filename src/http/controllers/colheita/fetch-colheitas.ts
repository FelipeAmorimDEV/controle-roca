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
    variedade: z.string().optional(),
  })

  const { perPage, initialDate, endDate, page, setorId, variedade } =
    requestQuerySchema.parse(request.query)

  const prismaColheitaRepository = new PrismaColheitaRepository()
  const fetchAllColheitasUseCase = new FetchAllColheitasUseCase(
    prismaColheitaRepository,
  )

  const { colheitas, total, totalColhido, lucroTotal } =
    await fetchAllColheitasUseCase.execute({
      endDate,
      initialDate,
      page,
      perPage,
      setorId,
      fazenda_id: request.user.fazenda_id,
      variedade,
    })

  console.log('Lucro total CONTROLLER', lucroTotal)

  return reply.status(200).send({ colheitas, total, totalColhido, lucroTotal })
}
