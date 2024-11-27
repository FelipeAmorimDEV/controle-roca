import { Prisma, Variedade } from '@prisma/client'
import { VariedadeRepository } from '../variedade-repository'
import { prisma } from '@/prisma'

export class PrismaVariedadeRepository implements VariedadeRepository {
  async findById(
    variedadeId: number,
    fazendaId: string,
  ): Promise<Variedade | null> {
    const variedade = await prisma.variedade.findUnique({
      where: {
        id: variedadeId,
        fazenda_id: fazendaId,
      },
    })

    return variedade
  }

  async createVariedade(
    data: Prisma.VariedadeUncheckedCreateInput,
  ): Promise<Variedade> {
    const variedade = await prisma.variedade.create({
      data,
    })

    return variedade
  }

  async fetchAllVariedades(fazendaId: string): Promise<Variedade[]> {
    const variedades = await prisma.variedade.findMany({
      where: {
        fazenda_id: fazendaId,
      },
      orderBy: {
        nome: 'asc',
      },
    })

    return variedades
  }
}
