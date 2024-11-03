import { prisma } from '@/prisma'
import { TipoRepository } from '../tipo-repository'
import { Prisma, Tipo } from '@prisma/client'

export class PrismaTipoRepository implements TipoRepository {
  async createTipo(data: Prisma.TipoUncheckedCreateInput): Promise<Tipo> {
    const tipo = await prisma.tipo.create({
      data,
    })

    return tipo
  }

  async fetchAllTipos(fazendaId: string): Promise<Tipo[]> {
    const tipos = await prisma.tipo.findMany({
      where: {
        fazenda_id: fazendaId,
      },
    })

    return tipos
  }
}
