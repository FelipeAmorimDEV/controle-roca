import { PrismaManutencaoRepository } from '@/repository/prisma/prisma-manutencao-repository'
import { RegisterManutencaoUseCase } from '@/usecases/register-manutencao-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function registerManutencao(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const requestParamsSchema = z.object({
    tratarId: z.string()
  })

  const registerManutencaoBodySchema = z.object({
    tipo: z.enum(['TROCA_OLEO', 'FILTROS', 'PREVENTIVA', 'CORRETIVA', 'OUTROS']),
    descricao: z.string(),
    custo: z.number().min(0),
    mecanico: z.string(),
    status: z.enum(['AGENDADA', 'EM_ANDAMENTO', 'CONCLUIDA', 'CANCELADA']).default('CONCLUIDA'),
    observacoes: z.string().optional(),
  })

  const { tratarId } = requestParamsSchema.parse(request.params)
  const {
    tipo,
    descricao,
    custo,
    mecanico,
    status,
    observacoes,
  } = registerManutencaoBodySchema.parse(request.body)

  const manutencaoRepository = new PrismaManutencaoRepository()
  const registerManutencaoUseCase = new RegisterManutencaoUseCase(manutencaoRepository)

  const manutencao = await registerManutencaoUseCase.execute({
    tratarId,
    tipo,
    descricao,
    custo,
    mecanico,
    status,
    observacoes,
    fazenda_id: request.user.fazenda_id,
  })

  return reply.status(201).send({
    success: true,
    message: 'Manutenção registrada com sucesso!',
    manutencao,
  })
}