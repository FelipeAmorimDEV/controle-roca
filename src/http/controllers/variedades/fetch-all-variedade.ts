import { PrismaVariedadeRepository } from '@/repository/prisma/prisma-variedade-repository'
import { FetchAllVariedadesUseCase } from '@/usecases/fetch-all-variedades-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'


export async function fetchAllVariedade(
  request: FastifyRequest,
  reply: FastifyReply,
) {
 
  const prismaVariedadeRepository = new PrismaVariedadeRepository()
  const fetchVariedadesUseCase = new FetchAllVariedadesUseCase(
    prismaVariedadeRepository,
  )

  try {
    const { variedades } = await fetchVariedadesUseCase.execute({})

    return reply.status(201).send(variedades)
  } catch (error) {
    throw error
  }
}
