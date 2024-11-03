import { PrismaQrcodeRepository } from '@/repository/prisma/prisma-qrcode-repository'
import { FetchAllQrcodeUseCase } from '@/usecases/fetch-all-qrcode'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function fetchAllQrcode(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const requestBodySchema = z.object({
    funcionarioId: z.string().optional(),
    initialDate: z.string(),
    endDate: z.string(),
  })

  const { funcionarioId, endDate, initialDate } = requestBodySchema.parse(
    request.query,
  )

  const prismaQrcodeRepository = new PrismaQrcodeRepository()
  const fetchAllQrcodeUsecase = new FetchAllQrcodeUseCase(
    prismaQrcodeRepository,
  )

  const { qrcodes } = await fetchAllQrcodeUsecase.execute({
    funcionarioId,
    initialDate,
    endDate,
  })

  return reply.status(200).send(qrcodes)
}
