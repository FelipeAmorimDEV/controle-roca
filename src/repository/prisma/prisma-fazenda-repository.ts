import { Fazenda, Prisma } from '@prisma/client'
import { prisma } from '@/prisma'
import { FazendaRepository } from '../fazenda-repository'

export class PrismaFazendaRepository implements FazendaRepository {
  async findFazendaById(fazendaId: string): Promise<Fazenda | null> {
    const fazenda = await prisma.fazenda.findUnique({
      where: {
        id: fazendaId,
      },
    })

    return fazenda
  }

  async createFazenda(data: Prisma.FazendaCreateInput): Promise<Fazenda> {
    const fazenda = await prisma.fazenda.create({
      data,
    })

    return fazenda
  }
}
