import { Caixa, Prisma } from '@prisma/client'

export interface CaixaRepository {
  fetchAllCaixa(fazendaId: string): Promise<Caixa[]>
  createCaixa(data: Prisma.CaixaUncheckedCreateInput): Promise<Caixa>
}
