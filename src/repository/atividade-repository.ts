import { Atividade, Prisma } from '@prisma/client'

export interface AtividadeRepository {
  createAtividade(data: Prisma.AtividadeCreateInput): Promise<Atividade>
  fetchAtividade(): Promise<Atividade[]>
}
