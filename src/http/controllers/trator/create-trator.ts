import { PrismaTratorRepository } from '@/repository/prisma/prisma-trator-repository'
import { CreateTratorUseCase } from '@/usecases/create-trator-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function createTrator(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const manutencoesSchema = z.object({
    tipo: z.enum(['CORRETIVA','FILTROS','OUTROS','PREVENTIVA','TROCA_OLEO']),
    intervaloHoras: z.coerce.number(),
    proximaManutencaoHoras: z.coerce.number(),
    descricao: z.string()
  })

  const createTratorBodySchema = z.object({
    nome: z.string(),
    marca: z.string(),
    modelo: z.string(),
    ano: z.coerce.number(),
    numeroSerie: z.string(),
    horasAtuais: z.coerce.number().min(0),
    dataCompra: z.coerce.date(),
    manutencoes: z.array(manutencoesSchema)
  })

  const {
    nome,
    marca,
    modelo,
    ano,
    numeroSerie,
    horasAtuais,
    dataCompra,
    manutencoes
  } = createTratorBodySchema.parse(request.body)

  console.log(request.body)

  const tratorRepository = new PrismaTratorRepository()
  const createTratorUseCase = new CreateTratorUseCase(tratorRepository)

  const trator = await createTratorUseCase.execute({
    nome,
    marca,
    modelo,
    ano,
    numeroSerie,
    horasAtuais,
    dataCompra,
    fazenda_id: request.user.fazenda_id,
    manutencoes
  })

  return reply.status(201).send({
    success: true,
    message: 'Trator registrado com sucesso!',
    trator,
  })
}