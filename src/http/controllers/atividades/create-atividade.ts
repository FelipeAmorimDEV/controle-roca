import { PrismaAtividadeRepository } from '@/repository/prisma/prisma-atividade-repository'
import { CreateAtividadeUseCase } from '@/usecases/create-atividade-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function createAtividade(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const requestBodySchema = z.object({
    nome: z.string(),
    categoria: z.string(),
    valorBonus: z.coerce.number(),
  })

  const { nome, categoria, valorBonus } = requestBodySchema.parse(request.body)

  const atividadeRepository = new PrismaAtividadeRepository()
  const createAtividade = new CreateAtividadeUseCase(atividadeRepository)

  const { atividade } = await createAtividade.execute({
    nome: nome.toUpperCase(),
    categoria,
    fazenda_id: request.user.fazenda_id,
    valorBonus,
  })

  return reply.status(201).send(atividade)
}
