import { Apontamento, Prisma } from '@prisma/client'

export interface ApontamentoRepository {
  createApontamento(
    data: Prisma.ApontamentoUncheckedCreateInput,
  ): Promise<Apontamento>
  concluirApontamento(
    apontamentoId: string,
    fazendaId: string,
    dataConclusao: string,
    qtdAtividade: number,
    custoTarefa: number,
    duracao: number,
    valorBonus: number,
  ): Promise<Apontamento>
  deleteApontamento(
    apontamentoId: string,
    fazendaId: string,
  ): Promise<Apontamento>
  findById(apontamentoId: string): Promise<Apontamento | null>
  findOnSameDateById(
    funcionarioId: string,
    date: Date,
  ): Promise<Apontamento | null>
}
