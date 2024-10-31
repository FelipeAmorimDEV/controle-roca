import { PrismaFuncionarioRepository } from '@/repository/prisma/prisma-funcionaro-repository'
import { PrismaVariedadeRepository } from '@/repository/prisma/prisma-variedade-repository'
import { CreateFuncionarioUseCase } from '@/usecases/create-funcionario-usecase'
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

  try {
    const { variedade } = await createVariedadeUsecase.execute({ nome: nome.toUpperCase() })
    return reply.status(201).send(variedade)
  } catch (error) {
    throw error
  }
}
