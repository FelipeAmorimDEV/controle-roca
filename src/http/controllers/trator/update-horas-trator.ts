import { PrismaTratorRepository } from '@/repository/prisma/prisma-trator-repository'
import { NotificationService } from '@/services/notification-service'
import { UpdateHorasTratorUseCase } from '@/usecases/update-horas-trator-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function updateHorasTrator(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const requestParamsSchema = z.object({
    tratarId: z.string()
  })

  const updateHorasBodySchema = z.object({
    horasNovas: z.number().min(0),
    descricao: z.string().optional(),
    operador: z.string(),
  })

  const { tratarId } = requestParamsSchema.parse(request.params)
  const { horasNovas, descricao, operador } = updateHorasBodySchema.parse(request.body)

  const tratorRepository = new PrismaTratorRepository()
  const notificationService = new NotificationService()
  const updateHorasTratorUseCase = new UpdateHorasTratorUseCase(tratorRepository, notificationService)

  await updateHorasTratorUseCase.execute({
    tratarId,
    horasNovas,
    descricao,
    operador,
    fazenda_id: request.user.fazenda_id,
  })

  return reply.status(200).send({
    success: true,
    message: 'Horímetro atualizado com sucesso!',
  })
}