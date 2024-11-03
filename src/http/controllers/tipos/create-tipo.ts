import { PrismaTipoRepository } from '@/repository/prisma/prisma-tipo-repository'
import { CreateTipoUseCase } from '@/usecases/create-tipo-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function createTipo(request: FastifyRequest, reply: FastifyReply) {
  const requestBodySchema = z.object({
    name: z.string(),
  })

  const { name } = requestBodySchema.parse(request.body)

  const prismaTipoRespository = new PrismaTipoRepository()
  const createTipoUsecase = new CreateTipoUseCase(prismaTipoRespository)

  const { tipo } = await createTipoUsecase.execute({
    name: name.toUpperCase(),
    fazenda_id: request.user.fazenda_id,
  })

  return reply.status(201).send(tipo)
}
