import { Prisma, Tipo } from '@prisma/client'

export interface TipoRepository {
  createTipo(data: Prisma.TipoUncheckedCreateInput): Promise<Tipo>
  fetchAllTipos(fazendaId: string): Promise<Tipo[]>
}
