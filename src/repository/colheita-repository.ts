import { Colheita, Prisma } from '@prisma/client'

export interface ColheitaResult {
  colheita: Colheita[]
  total: number
  totalColhido: number | null
}

export interface IProducaoMensal {
  mes: string
  quantidade: number
}

export interface ColheitaRepository {
  getProducaoMensal(): Promise<IProducaoMensal[]>
  createColheita(data: Prisma.ColheitaUncheckedCreateInput): Promise<Colheita>
  deleteColheita(colheitaId: string): Promise<Colheita>
  fetchAllColheita(
    initialDate: string,
    endDate: string,
    page: number,
    perPage: number,
    setorId?: string,
  ): Promise<ColheitaResult>
}
