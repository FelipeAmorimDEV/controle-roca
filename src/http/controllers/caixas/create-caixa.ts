import { PrismaCaixaRepository } from '@/repository/prisma/prisma-caixa-repository'
import { CreateCaixaUseCase } from '@/usecases/create-caixa-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function createCaixa(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const requestBodySchema = z.object({
    nome: z.string(),
  })

  const { nome } = requestBodySchema.parse(request.body)

  const prismaCaixaRepository = new PrismaCaixaRepository()
  const createCaixaUseCase = new CreateCaixaUseCase(prismaCaixaRepository)

  const { caixa } = await createCaixaUseCase.execute({
    nome: nome.toUpperCase(),
    fazenda_id: request.user.fazenda_id,
  })

  return reply.status(201).send(caixa)
}
