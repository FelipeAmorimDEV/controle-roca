import { Prisma, Variedade } from '@prisma/client'

export interface VariedadeRepository {
  createVariedade(
    data: Prisma.VariedadeUncheckedCreateInput,
  ): Promise<Variedade>
  fetchAllVariedades(fazendaId: string): Promise<Variedade[]>
  findById(variedadeId: number, fazendaId: string): Promise<Variedade | null>
}
