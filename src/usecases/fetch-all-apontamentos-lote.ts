/* eslint-disable no-useless-constructor */
import { ApontamentosI } from '@/repository/prisma/prisma-setor-repository'
import { SetorRepository } from '@/repository/setor-repository'

interface FetchAllApontamentoLoteUseCaseResponse {
  apontamentos: ApontamentosI[]
}

interface FetchAllApontamentoLoteUseCaseParams {
  setorId?: string
}

export class FetchAllApontamentoLoteUseCase {
  constructor(private setorRepository: SetorRepository) {}

  async execute({
    setorId,
  }: FetchAllApontamentoLoteUseCaseParams): Promise<FetchAllApontamentoLoteUseCaseResponse> {
    const apontamentos = await this.setorRepository.fetchAllApontamentos()

    return { apontamentos }
  }
}

// fix lote
