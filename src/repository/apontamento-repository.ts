import { Apontamento, Prisma } from '@prisma/client'

export interface ApontamentoRepository {
  createApontamento(
    data: Prisma.ApontamentoUncheckedCreateInput,
  ): Promise<Apontamento>
  concluirApontamento(
    apontamentoId: string,
    fazendaId: string,
  ): Promise<Apontamento>
  deleteApontamento(
    apontamentoId: string,
    fazendaId: string,
  ): Promise<Apontamento>
}
