import { PrismaQrcodePalletRepository } from '@/repository/prisma/prisma-qrcode-pallet-repository'
import { FuncionarioNaoExiste } from '@/usecases/errors/funcionario-nao-existe'
import { FetchAllPalletsUseCase } from '@/usecases/fetch-all-pallets'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'



export async function fetchAllPallets(request: FastifyRequest, reply: FastifyReply) {
  const requestQuerySchema = z.object({
    page: z.coerce.number(),
    perPage: z.coerce.number()
  })

  const { page, perPage } = requestQuerySchema.parse(request.query)

  const prismaQrcodePalletRepository = new PrismaQrcodePalletRepository()
  const fetchAllPallets = new FetchAllPalletsUseCase(prismaQrcodePalletRepository)

  try {
    const { pallets, totalPallets } = await fetchAllPallets.execute({page, perPage})

    return reply.status(201).send({ pallets, totalPallets })
  } catch (error) {
    if (error instanceof FuncionarioNaoExiste) {
      return reply.status(400).send({message: error.message})
    }

    throw error
  }
}
