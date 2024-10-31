import { Prisma, Tratorista } from '@prisma/client'
import { TratoristaRepository } from '../tratorista-repository'
import { prisma } from '@/prisma'

export class PrismTratoristaRepository implements TratoristaRepository {
  async fetchAllTratorista(): Promise<Tratorista[]> {
    const tratoristas = prisma.tratorista.findMany()

    return tratoristas
  }

  async createTratorista(
    data: Prisma.TratoristaCreateInput,
  ): Promise<Tratorista> {
    const tratorista = await prisma.tratorista.create({
      data,
    })

    return tratorista
  }
}
