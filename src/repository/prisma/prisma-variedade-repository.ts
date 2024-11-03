import { Prisma, Variedade } from '@prisma/client'
import { VariedadeRepository } from '../variedade-repository'
import { prisma } from '@/prisma'

export class PrismaVariedadeRepository implements VariedadeRepository {
  async findById(variedadeId: number): Promise<Variedade | null> {
    const variedade = await prisma.variedade.findUnique({
      where: {
        id: variedadeId,
      },
    })

    return variedade
  }

  async createVariedade(data: Prisma.VariedadeCreateInput): Promise<Variedade> {
    const variedade = await prisma.variedade.create({
      data,
    })

    return variedade
  }

  async fetchAllVariedades(): Promise<Variedade[]> {
    const variedades = await prisma.variedade.findMany()

    return variedades
  }
}
