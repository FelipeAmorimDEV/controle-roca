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
  })

  const { q } = requestQuerySchema.parse(request.query)

  const prismaFuncionarioRepository = new PrismaFuncionarioRepository()
  const fetchAllFuncionariosUseCase = new FetchAllFuncionariosWithQrcodeUseCase(
    prismaFuncionarioRepository,
  )

  const { funcionarios } = await fetchAllFuncionariosUseCase.execute({ q })

  return reply.status(201).send(funcionarios)
}
