import { PrismaFuncionarioRepository } from '@/repository/prisma/prisma-funcionaro-repository'
import { PrismaQrcodePalletRepository } from '@/repository/prisma/prisma-qrcode-pallet-repository'
import { PrismaQrcodeRepository } from '@/repository/prisma/prisma-qrcode-repository'
import { CreateFuncionarioUseCase } from '@/usecases/create-funcionario-usecase'
import { CreateQrcodePalletUseCase } from '@/usecases/create-qrcode-pallet-usecase'
import { CreateQrcodeUseCase } from '@/usecases/create-qrcode-usecase'
import { FuncionarioNaoExiste } from '@/usecases/errors/funcionario-nao-existe'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'


export async function generateQrcodesPallet(request: FastifyRequest, reply: FastifyReply) {
  const requestBodySchema = z.object({
    quantidade: z.coerce.number(),
    variedadeId: z.coerce.number(),
    peso: z.coerce.number(),
    caixaId: z.coerce.number(),
    qtdCaixas: z.coerce.number()
  })

  const {  quantidade, caixaId, peso,variedadeId, qtdCaixas } = requestBodySchema.parse(request.body)

 
  const prismaQrcodePalletRepository = new PrismaQrcodePalletRepository()
  const createQrcodePalletUseCase = new CreateQrcodePalletUseCase(prismaQrcodePalletRepository)

  try {
    const { qrcodes } = await createQrcodePalletUseCase.execute({  quantidade, caixaId,peso,variedadeId, qtdCaixas })

    return reply.status(201).send(qrcodes)
  } catch (error) {
    if (error instanceof FuncionarioNaoExiste) {
      return reply.status(400).send({message: error.message})
    }

    throw error
  }
}
