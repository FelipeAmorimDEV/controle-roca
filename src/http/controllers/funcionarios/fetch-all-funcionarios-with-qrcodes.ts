import { PrismaFuncionarioRepository } from '@/repository/prisma/prisma-funcionaro-repository'
import { FetchAllFuncionariosWithQrcodeUseCase } from '@/usecases/fetch-all-funcionarios-with-qrcodes'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function fetchAllFuncionariosWithQrcode(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const requestQuerySchema = z.object({
    q: z.string().optional(),
    initialDate: z.string(),
    endDate: z.string(),
  })

  const { q, endDate, initialDate } = requestQuerySchema.parse(request.query)

  const prismaFuncionarioRepository = new PrismaFuncionarioRepository()
  const fetchAllFuncionariosUseCase = new FetchAllFuncionariosWithQrcodeUseCase(
    prismaFuncionarioRepository,
  )

  const { funcionarios } = await fetchAllFuncionariosUseCase.execute({
    q,
    initialDate,
    endDate,
  })

  return reply.status(200).send(funcionarios)
}
