import { Manutencao, TipoManutencao, StatusManutencao } from '@prisma/client'

export interface CreateManutencao {
  tratarId: string
  tipo: TipoManutencao
  descricao: string
  custo: number
  mecanico: string
  status?: StatusManutencao
  observacoes?: string
  fazenda_id: string
}

export interface FetchManutencoes {
  manutencoes: Manutencao[]
  totalManutencoes: number
}

export interface RelatorioCustomos {
  custoTotal: number
  totalManutencoes: number
  custosPorTipo: Record<string, number>
  manutencoes: Manutencao[]
}

export interface ManutencaoRepository {
  create(data: CreateManutencao): Promise<Manutencao>
  fetchByTrator(
    tratarId: string,
    fazenda_id: string,
    dataInicial?: string,
    dataFinal?: string
  ): Promise<FetchManutencoes>
  getRelatorioCustomos(
    tratarId: string,
    fazenda_id: string,
    dataInicial?: string,
    dataFinal?: string
  ): Promise<RelatorioCustomos>
}