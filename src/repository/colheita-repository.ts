import { Colheita, Prisma } from '@prisma/client'
import { ITipoCaixaData } from './prisma/prisma-colheita-repository'

export interface ColheitaResult {
  colheita: Colheita[]
  total: number
  totalColhido: number | null
  lucroTotal: number
}

export interface IProducaoMensal {
  mes: string
  TOTAL: number
}

export interface ColheitaRepository {
  getProducaoMensal(fazendaId: string): Promise<IProducaoMensal[]>
  atualizarValores(fazendaId: string): Promise<string>
  createColheita(data: Prisma.ColheitaUncheckedCreateInput): Promise<Colheita>
  deleteColheita(colheitaId: string, fazendaId: string): Promise<Colheita>
  getTiposCaixaHistorico(fazendaId: string): Promise<ITipoCaixaData[]>
  fetchAllColheita(
    initialDate: string,
    endDate: string,
    page: number,
    perPage: number,
    fazendaId: string,
    setorId?: string,
    variedade?: string,
  ): Promise<ColheitaResult>
}
