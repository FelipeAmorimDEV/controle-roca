import { PrismaFuncionarioRepository } from '@/repository/prisma/prisma-funcionaro-repository'
import { DesativarFuncionarioUseCase } from '@/usecases/desativar-funcionario-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function desativarFuncionario(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const requestBodySchema = z.object({
    funcionarioId: z.string()
  })

  const { funcionarioId } = requestBodySchema.parse(request.body)

  const prismaFuncionarioRepository = new PrismaFuncionarioRepository()
  const desativarFuncionario = new DesativarFuncionarioUseCase(
    prismaFuncionarioRepository,
  )

 await desativarFuncionario.execute({
    fazenda_id: request.user.fazenda_id,
    funcionarioId
  })

  return reply.status(201).send({ message: "Funcionario desativado com sucesso!" })
}
