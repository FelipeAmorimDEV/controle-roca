import { PrismaQrcodePalletRepository } from '@/repository/prisma/prisma-qrcode-pallet-repository'
import { PalletIndisponivel } from '@/usecases/errors/pallet-indisponivel'
import { PalletNaoExiste } from '@/usecases/errors/pallet-nao-existe'
import { QrcodeNaoExiste } from '@/usecases/errors/qrcode-nao-existe'
import { QrcodeUtilizado } from '@/usecases/errors/qrcode-utilizado'
import { ValidateQrcodePalletUseCase } from '@/usecases/validate-qrcode-pallet-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function validateQrcodePallet(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const requestBodySchema = z.object({
    qrCodeData: z.object({
      palletId: z.string().uuid()
    }),
  })

  const { qrCodeData } = requestBodySchema.parse(request.body)

  const prismaQrcodePalletRepository = new PrismaQrcodePalletRepository()
  const validateQrcodePalletUsecase = new ValidateQrcodePalletUseCase(
    prismaQrcodePalletRepository,
  )

  try {
    const { qrcode } = await validateQrcodePalletUsecase.execute({ qrCodeData })

    return reply.status(201).send(qrcode)
  } catch (error) {
    if (error instanceof PalletNaoExiste) {
      return reply.status(409).send({ message: error.message })
    }

    if (error instanceof PalletIndisponivel) {
      return reply.status(409).send({ message: error.message })
    }

    throw error
  }
}
