import { Fazenda, Prisma } from '@prisma/client'
import { prisma } from '@/prisma'
import { FazendaRepository } from '../fazenda-repository'

export class PrismaFazendaRepository implements FazendaRepository {
  async createFazenda(data: Prisma.FazendaCreateInput): Promise<Fazenda> {
    const fazenda = await prisma.fazenda.create({
      data,
    })

    return fazenda
  }
}
