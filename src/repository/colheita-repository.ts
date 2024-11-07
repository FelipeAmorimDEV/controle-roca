import { Colheita, Prisma } from '@prisma/client'

export interface ColheitaResult {
  colheita: Colheita[]
  total: number
  totalColhido: number | null
}

export interface IProducaoMensal {
  mes: string
  TOTAL: number
}

export interface ColheitaRepository {
  getProducaoMensal(fazendaId: string): Promise<IProducaoMensal[]>
  createColheita(data: Prisma.ColheitaUncheckedCreateInput): Promise<Colheita>
  deleteColheita(colheitaId: string, fazendaId: string): Promise<Colheita>
  fetchAllColheita(
    initialDate: string,
    endDate: string,
    page: number,
    perPage: number,
    fazendaId: string,
    setorId?: string,
    variedadeId?: number,
  ): Promise<ColheitaResult>
}
