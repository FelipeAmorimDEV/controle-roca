import { PrismaFuncionarioRepository } from '@/repository/prisma/prisma-funcionaro-repository'
import { CreateFuncionarioUseCase } from '@/usecases/create-funcionario-usecase'
import { UpdateFuncionarioUseCase } from '@/usecases/update-funcionario-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function updateFuncionario(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const requestBodySchema = z.object({
    cargo: z.string(),
    tipoContratacao: z.string(),
    funcionarioId: z.string()
  })

  const {  cargo, tipoContratacao, funcionarioId } = requestBodySchema.parse(request.body)

  const prismaFuncionarioRepository = new PrismaFuncionarioRepository()
  const updateFuncionario = new UpdateFuncionarioUseCase(
    prismaFuncionarioRepository,
  )

 await updateFuncionario.execute({
    cargo,
    fazenda_id: request.user.fazenda_id,
    tipoContratacao,
    funcionarioId
  })

  return reply.status(201).send({message: "Funcionario atualizado com sucesso!"})
}
