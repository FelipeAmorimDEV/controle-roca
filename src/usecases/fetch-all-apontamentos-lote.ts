/* eslint-disable no-useless-constructor */
import { ApontamentosI } from '@/repository/prisma/prisma-setor-repository'
import { SetorRepository } from '@/repository/setor-repository'

interface FetchAllApontamentoLoteUseCaseResponse {
  apontamentos: ApontamentosI[]
  total: number
}

interface FetchAllApontamentoLoteUseCaseParams {
  setorId?: string
  atividadeId?: string
  initialDate: string
  endDate: string
  page: number
  perPage: number
  fazenda_id: string
}

export class FetchAllApontamentoLoteUseCase {
  constructor(private setorRepository: SetorRepository) {}

  async execute({
    setorId,
    fazenda_id,
    endDate,
    initialDate,
    page,
    perPage,
    atividadeId,
  }: FetchAllApontamentoLoteUseCaseParams): Promise<FetchAllApontamentoLoteUseCaseResponse> {
    const { apontamentos, total } =
      await this.setorRepository.fetchAllApontamentos(
        fazenda_id,
        initialDate,
        endDate,
        page,
        perPage,
        setorId,
        atividadeId,
      )

    return { apontamentos, total }
  }
}

// fix lote
