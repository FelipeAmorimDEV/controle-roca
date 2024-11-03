import { PrismaUserRepository } from '@/repository/prisma/prisma-user-repository'
import { CreateUserUseCase } from '@/usecases/create-user-usecase'
import { UserAlreadyExists } from '@/usecases/errors/user-already-exist'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function createUser(request: FastifyRequest, reply: FastifyReply) {
  const requestBodySchema = z.object({
    user: z.string(),
    password: z.string(),
    fazendaId: z.string(),
  })

  const { user, password, fazendaId } = requestBodySchema.parse(request.body)

  const prismaUserRepository = new PrismaUserRepository()
  const createUserUseCase = new CreateUserUseCase(prismaUserRepository)

  try {
    await createUserUseCase.execute({ user, password, fazendaId })
    return reply.status(201).send()
  } catch (error) {
    if (error instanceof UserAlreadyExists) {
      return reply.status(409).send({ message: error.message })
    }

    throw error
  }
}
