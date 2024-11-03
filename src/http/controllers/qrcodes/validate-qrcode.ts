import { PrismaColheitaRepository } from '@/repository/prisma/prisma-colheita-repository'
import { PrismaQrcodePalletRepository } from '@/repository/prisma/prisma-qrcode-pallet-repository'
import { PrismaQrcodeRepository } from '@/repository/prisma/prisma-qrcode-repository'
import { PrismaVariedadeRepository } from '@/repository/prisma/prisma-variedade-repository'
import { PalletCheio } from '@/usecases/errors/pallet-cheio'
import { QrcodeNaoExiste } from '@/usecases/errors/qrcode-nao-existe'
import { QrcodeUtilizado } from '@/usecases/errors/qrcode-utilizado'

import { ValidateQrcodeUseCase } from '@/usecases/validate-qrcode-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function validateQrcode(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const requestBodySchema = z.object({
    qrCodeData: z.object({
      nome: z.string(),
      qrcodeId: z.string(),
      funcionarioId: z.string(),
    }),
    palletId: z.string().uuid(),
  })

  const { qrCodeData, palletId } = requestBodySchema.parse(request.body)

  const prismaQrcodeRepository = new PrismaQrcodeRepository()
  const prismaQrcodePalletRepository = new PrismaQrcodePalletRepository()
  const colheitaRepository = new PrismaColheitaRepository()
  const variedadeRepository = new PrismaVariedadeRepository()
  const validateQrcodeUsecase = new ValidateQrcodeUseCase(
    prismaQrcodeRepository,
    prismaQrcodePalletRepository,
    colheitaRepository,
    variedadeRepository,
  )

  try {
    const { qrcode } = await validateQrcodeUsecase.execute({
      qrCodeData,
      palletId,
      fazenda_id: request.user.fazenda_id,
    })

    return reply.status(200).send(qrcode)
  } catch (error) {
    if (error instanceof QrcodeNaoExiste) {
      return reply.status(409).send({ message: error.message })
    }

    if (error instanceof PalletCheio) {
      return reply.status(409).send({ message: error.message })
    }

    if (error instanceof QrcodeUtilizado) {
      return reply.status(409).send({ message: error.message })
    }

    throw error
  }
}
