import { PrismaFuncionarioRepository } from '@/repository/prisma/prisma-funcionaro-repository'
import { CreateFuncionarioUseCase } from '@/usecases/create-funcionario-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function createFuncionario(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const requestBodySchema = z.object({
    nome: z.string(),
    cargo: z.string(),
  })

  const { nome, cargo } = requestBodySchema.parse(request.body)

  const prismaFuncionarioRepository = new PrismaFuncionarioRepository()
  const createFuncionarioUseCase = new CreateFuncionarioUseCase(
    prismaFuncionarioRepository,
  )

  const { funcionario } = await createFuncionarioUseCase.execute({
    nome: nome.toUpperCase(),
    cargo,
    fazenda_id: request.user.fazenda_id,
  })
  return reply.status(201).send(funcionario)
}
