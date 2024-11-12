import { PrismaSetorRepository } from '@/repository/prisma/prisma-setor-repository'
import { FetchAllApontamentoLoteUseCase } from '@/usecases/fetch-all-apontamentos-lote'
import { GetCentroCustoUseCase } from '@/usecases/get-centro-custo-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function getCentroCusto(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const requestQuerySchema = z.object({
    initialDate: z.string(),
    endDate: z.string(),
  })

  const { initialDate, endDate } = requestQuerySchema.parse(request.query)

  const prismaSetorRepository = new PrismaSetorRepository()
  const getCentroCusto = new GetCentroCustoUseCase(prismaSetorRepository)

  const { setores } = await getCentroCusto.execute({
    fazenda_id: request.user.fazenda_id,
    initialDate,
    endDate,
  })

  return reply.status(200).send(setores)
}
