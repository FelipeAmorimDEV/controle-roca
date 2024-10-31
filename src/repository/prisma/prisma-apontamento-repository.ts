import { Apontamento, Prisma } from '@prisma/client'
import { prisma } from '@/prisma'
import { ApontamentoRepository } from '../apontamento-repository'

export class PrismaApontamentoRepository implements ApontamentoRepository {
  async deleteApontamento(apontamentoId: string): Promise<Apontamento> {
    const apontamento = await prisma.apontamento.delete({
      where: {
        id: apontamentoId,
      },
    })

    return apontamento
  }

  async concluirApontamento(apontamentoId: string): Promise<Apontamento> {
    const apontamento = await prisma.apontamento.update({
      where: {
        id: apontamentoId,
      },
      data: {
        data_fim: new Date(),
        status: 'concluida',
      },
    })

    return apontamento
  }

  async createApontamento(
    data: Prisma.ApontamentoUncheckedCreateInput,
  ): Promise<Apontamento> {
    const apontamento = await prisma.apontamento.create({
      data,
    })

    return apontamento
  }
}
