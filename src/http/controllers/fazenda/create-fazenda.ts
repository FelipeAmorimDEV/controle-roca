import { PrismaFazendaRepository } from '@/repository/prisma/prisma-fazenda-repository'
import { CreateFazendaUseCase } from '@/usecases/create-fazenda-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function createFazenda(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const requestBodySchema = z.object({
    nome: z.string(),
  })

  const { nome } = requestBodySchema.parse(request.body)

  const fazendaRepository = new PrismaFazendaRepository()
  const createFazenda = new CreateFazendaUseCase(fazendaRepository)

  const { fazenda } = await createFazenda.execute({ nome })

  return reply.status(201).send(fazenda)
}
