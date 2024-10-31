import { prisma } from '@/prisma'
import { TipoRepository } from '../tipo-repository'
import { Prisma, Tipo } from '@prisma/client'

export class PrismaTipoRepository implements TipoRepository {
  async createTipo(data: Prisma.TipoCreateInput): Promise<Tipo> {
    const tipo = await prisma.tipo.create({
      data,
    })

    return tipo
  }

  async fetchAllTipos(): Promise<Tipo[]> {
    const tipos = await prisma.tipo.findMany()

    return tipos
  }
}
