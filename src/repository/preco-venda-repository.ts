import { PrecoVenda, Prisma } from '@prisma/client'

export interface PrecoVendaRepository {
  fetchManyByFarmId(farmId: string): Promise<PrecoVenda[]>
  create(data: Prisma.PrecoVendaUncheckedCreateInput): Promise<PrecoVenda>
  delete(precoVendaId: string): Promise<PrecoVenda>
}
