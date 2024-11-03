import { PrismaVariedadeRepository } from '@/repository/prisma/prisma-variedade-repository'
import { CreateVariedadeUseCase } from '@/usecases/create-variedade-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function createVariedade(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const requestBodySchema = z.object({
    nome: z.string(),
  })

  const { nome } = requestBodySchema.parse(request.body)

  const prismaVariedadeRepository = new PrismaVariedadeRepository()
  const createVariedadeUsecase = new CreateVariedadeUseCase(
    prismaVariedadeRepository,
  )

  const { variedade } = await createVariedadeUsecase.execute({
    nome: nome.toUpperCase(),
    fazenda_id: request.user.fazenda_id,
  })

  return reply.status(201).send(variedade)
}
