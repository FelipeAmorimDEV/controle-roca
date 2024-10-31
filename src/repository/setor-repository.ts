import { Prisma, Setor } from '@prisma/client'
import { ApontamentosI } from './prisma/prisma-setor-repository'

export interface SetorRepository {
  createSetor(data: Prisma.SetorCreateInput): Promise<Setor>
  fetchAllSetor(): Promise<Setor[]>
  fetchAllApontamentos(): Promise<ApontamentosI[]>
}
