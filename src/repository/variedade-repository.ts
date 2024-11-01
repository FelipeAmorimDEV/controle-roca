import {  Prisma, Variedade } from '@prisma/client'

export interface VariedadeRepository {
  createVariedade(data: Prisma.VariedadeCreateInput): Promise<Variedade>
  fetchAllVariedades(): Promise<Variedade[]>
}
