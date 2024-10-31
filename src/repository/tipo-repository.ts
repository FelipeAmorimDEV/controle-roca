import { Prisma, Tipo } from '@prisma/client'

export interface TipoRepository {
  createTipo(data: Prisma.TipoCreateInput): Promise<Tipo>
  fetchAllTipos(): Promise<Tipo[]>
}
