import { PrismaFuncionarioRepository } from '@/repository/prisma/prisma-funcionaro-repository'
import { PrismaQrcodeRepository } from '@/repository/prisma/prisma-qrcode-repository'
import { CreateQrcodeUseCase } from '@/usecases/create-qrcode-usecase'
import { FuncionarioNaoExiste } from '@/usecases/errors/funcionario-nao-existe'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function generateQrcodes(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const requestBodySchema = z.object({
    quantidade: z.coerce.number(),
    funcionarioId: z.string().uuid(),
  })

  const { funcionarioId, quantidade } = requestBodySchema.parse(request.body)

  const prismaFuncionarioRepository = new PrismaFuncionarioRepository()
  const prismaQrcodeRepository = new PrismaQrcodeRepository()
  const createQrcodeUseCase = new CreateQrcodeUseCase(
    prismaQrcodeRepository,
    prismaFuncionarioRepository,
  )

  try {
    const { qrcodes } = await createQrcodeUseCase.execute({
      funcionarioId,
      quantidade,
      fazenda_id: request.user.fazenda_id,
    })

    return reply.status(201).send(qrcodes)
  } catch (error) {
    if (error instanceof FuncionarioNaoExiste) {
      return reply.status(400).send({ message: error.message })
    }

    throw error
  }
}
