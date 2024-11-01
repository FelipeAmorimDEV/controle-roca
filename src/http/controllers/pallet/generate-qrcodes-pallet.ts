import { PrismaQrcodePalletRepository } from '@/repository/prisma/prisma-qrcode-pallet-repository'
import { CreateQrcodePalletUseCase } from '@/usecases/create-qrcode-pallet-usecase'
import { FuncionarioNaoExiste } from '@/usecases/errors/funcionario-nao-existe'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function generateQrcodesPallet(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const requestBodySchema = z.object({
    quantidade: z.coerce.number(),
    variedadeId: z.coerce.number(),
    peso: z.coerce.number(),
    caixaId: z.coerce.number(),
    qtdCaixas: z.coerce.number(),
    setorId: z.string().uuid(),
  })

  const { quantidade, caixaId, peso, variedadeId, qtdCaixas, setorId } =
    requestBodySchema.parse(request.body)

  const prismaQrcodePalletRepository = new PrismaQrcodePalletRepository()
  const createQrcodePalletUseCase = new CreateQrcodePalletUseCase(
    prismaQrcodePalletRepository,
  )

  try {
    const { qrcodes } = await createQrcodePalletUseCase.execute({
      quantidade,
      caixaId,
      peso,
      variedadeId,
      qtdCaixas,
      setorId,
    })

    return reply.status(201).send(qrcodes)
  } catch (error) {
    if (error instanceof FuncionarioNaoExiste) {
      return reply.status(400).send({ message: error.message })
    }

    throw error
  }
}
