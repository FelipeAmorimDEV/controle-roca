import { PrismaFuncionarioRepository } from '@/repository/prisma/prisma-funcionaro-repository'
import { FetchValorBonusColaborador } from '@/usecases/fetch-valor-bonus-colaborador'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function fetchValorBonus(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const requestBodySchema = z.object({
    startDate: z.string().date(),
    endDate: z.string().date(),
  })

  const { startDate, endDate } = requestBodySchema.parse(request.query)

  const prismaFuncionarioRepository = new PrismaFuncionarioRepository()
  const fetchAllFuncionariosUseCase = new FetchValorBonusColaborador(
    prismaFuncionarioRepository,
  )
  const { listaDeBonus } = await fetchAllFuncionariosUseCase.execute({
    fazendaId: request.user.fazenda_id,
    startDate,
    endDate,
  })

  return reply.status(200).send(listaDeBonus)
}
