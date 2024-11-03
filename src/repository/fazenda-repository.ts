import { Fazenda, Prisma } from '@prisma/client'

export interface FazendaRepository {
  createFazenda(data: Prisma.FazendaCreateInput): Promise<Fazenda>
  findFazendaById(fazendaId: string): Promise<Fazenda | null>
}
