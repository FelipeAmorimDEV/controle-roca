import { PrismaQrcodePalletRepository } from '@/repository/prisma/prisma-qrcode-pallet-repository'
import { DeletePalletUseCase } from '@/usecases/delete-pallet-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function deletePallet(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const requestParamsSchema = z.object({
    palletId: z.string().uuid(),
  })

  const { palletId } = requestParamsSchema.parse(request.params)

  const palletRepository = new PrismaQrcodePalletRepository()
  const deletePallet = new DeletePalletUseCase(palletRepository)

  await deletePallet.execute({
    palletId,
    fazenda_id: request.user.fazenda_id,
  })

  return reply.status(200).send()
}
