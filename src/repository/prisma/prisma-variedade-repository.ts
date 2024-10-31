import {  Prisma, Variedade } from '@prisma/client'
import { VariedadeRepository } from '../variedade-repository'
import { prisma } from '@/prisma'

export class PrismaVariedadeRepository implements VariedadeRepository {
  async createVariedade(data: Prisma.VariedadeCreateInput): Promise<Variedade> {
    const variedade = await prisma.variedade.create({
      data
    })

    return variedade
  }

  async fetchAllVariedades(): Promise<Variedade[]> {
    const variedades = await prisma.variedade.findMany()

    return variedades
  }
}
