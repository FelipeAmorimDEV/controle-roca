import { PrismaQrcodePalletRepository } from '@/repository/prisma/prisma-qrcode-pallet-repository'
import { FuncionarioNaoExiste } from '@/usecases/errors/funcionario-nao-existe'
import { FetchAllPalletsUseCase } from '@/usecases/fetch-all-pallets'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function fetchAllPallets(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const requestQuerySchema = z.object({
    page: z.coerce.number(),
    perPage: z.coerce.number(),
    initialDate: z.string(),
    endDate: z.string(),
    classificacaoId: z.coerce.number().optional(),
    variedadeId: z.coerce.number().optional(),
    status: z.string().optional(),
  })

  const {
    page,
    perPage,
    endDate,
    initialDate,
    classificacaoId,
    variedadeId,
    status,
  } = requestQuerySchema.parse(request.query)

  const prismaQrcodePalletRepository = new PrismaQrcodePalletRepository()
  const fetchAllPallets = new FetchAllPalletsUseCase(
    prismaQrcodePalletRepository,
  )

  try {
    const { pallets, totalPallets } = await fetchAllPallets.execute({
      page,
      perPage,
      endDate,
      initialDate,
      classificacaoId,
      variedadeId,
      status,
    })

    return reply.status(200).send({ pallets, totalPallets })
  } catch (error) {
    if (error instanceof FuncionarioNaoExiste) {
      return reply.status(400).send({ message: error.message })
    }

    throw error
  }
}
