import { PrismaUserRepository } from '@/repository/prisma/prisma-user-repository'
import { AuthenticateUserUseCase } from '@/usecases/authenticate-user-usecase'
import { CredentialInvalid } from '@/usecases/errors/credential-invalid'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function authenticateUser(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const requestBodySchema = z.object({
    user: z.string(),
    password: z.string(),
  })

  const { user, password } = requestBodySchema.parse(request.body)

  const prismaUserRepository = new PrismaUserRepository()
  const authenticateUsecase = new AuthenticateUserUseCase(prismaUserRepository)

  try {
    const { users } = await authenticateUsecase.execute({
      user,
      password,
    })
    const token = await reply.jwtSign(
      {
        fazenda_id: users.fazenda_id,
        fazendaNome: users.fazenda_nome,
      },
      {
        sign: {
          sub: users.id,
        },
      },
    )
    return reply.status(200).send({ token })
  } catch (error) {
    if (error instanceof CredentialInvalid) {
      return reply.status(401).send({ message: error.message })
    }

    throw error
  }
}
