import { Apontamento, Prisma } from '@prisma/client'
import { AtividadesRecentesResult, CardsSuperioresResponseDTO } from './prisma/prisma-apontamento-repository'

export interface ApontamentoRepository {
  getAtividadesRecentes(fazenda_id: string): Promise<AtividadesRecentesResult>
  getCardsSuperiores(fazendaId: string): Promise<CardsSuperioresResponseDTO>
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
