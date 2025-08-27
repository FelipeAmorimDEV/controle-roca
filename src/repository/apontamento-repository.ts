import { Apontamento, Prisma } from '@prisma/client'
import { AtividadesRecentesResult, CardsSuperioresResponseDTO } from './prisma/prisma-apontamento-repository'

// =============================================
// NOVOS DTOs PARA METAS EXCEDIDAS
// =============================================

export interface AtividadeExtraDTO {
  id: string
  name: string
  date: string
  meta: number
  realizado: number
  extras: number
  valorUnitario: number
  setor: string
  status: string
}

export interface FuncionarioMetasExcedidasDTO {
  id: string
  name: string
  role: string
  avatar: string
  totalExtras: number
  totalValue: number
  activities: AtividadeExtraDTO[]
}

export interface StatsMetasExcedidasDTO {
  totalExtras: number
  funcionariosAtivos: number
  valorTotalExtra: number
  atividadesDiferentes: number
  atividadesNomes: string[]
}

export interface FiltrosMetasExcedidasDTO {
  funcionarioNome?: string
  atividadeNome?: string
  setorId?: string
}

export interface PeriodoDTO {
  inicio: Date
  fim: Date
}

// =============================================
// INTERFACE DO REPOSITÓRIO ATUALIZADA
// =============================================

export interface ApontamentoRepository {
  // Funções já existentes
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

  // NOVAS FUNÇÕES PARA METAS EXCEDIDAS
  getFuncionariosMetasExcedidas(
    fazendaId: string,
    dataInicio: Date,
    dataFim: Date
  ): Promise<FuncionarioMetasExcedidasDTO[]>

  getStatsMetasExcedidas(
    fazendaId: string,
    dataInicio: Date,
    dataFim: Date
  ): Promise<StatsMetasExcedidasDTO>

  getFuncionariosMetasExcedidasFiltrado(
    fazendaId: string,
    dataInicio: Date,
    dataFim: Date,
    filtros: FiltrosMetasExcedidasDTO
  ): Promise<FuncionarioMetasExcedidasDTO[]>

}