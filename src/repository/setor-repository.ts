import { Prisma, Setor } from '@prisma/client'
import { ApontamentosI } from './prisma/prisma-setor-repository'

export interface RelatorioCentroCusto {
  setor: string
  custoTotalMaterial: number
  custoTotalMaoDeObra: number
  custoTotal: number
}
export interface SetorRepository {
  createSetor(data: Prisma.SetorUncheckedCreateInput): Promise<Setor>
  fetchAllSetor(fazendaId: string): Promise<Setor[]>
  fetchAllApontamentos(
    fazendaId: string,
    initialDate: string,
    endDate: string,
    page: number,
    perPage: number,
    setorId?: string,
    atividadeId?: string,
  ): Promise<ApontamentosI[]>
  fetchAllApontamentosFiscal(fazendaId: string): Promise<ApontamentosI[]>
  getCentroCusto(
    fazendaId: string,
    initialDate: string,
    endDate: string,
  ): Promise<RelatorioCentroCusto[]>
}
