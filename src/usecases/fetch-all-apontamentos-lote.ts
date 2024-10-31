/* eslint-disable no-useless-constructor */
import { SetorRepository } from '@/repository/setor-repository'
import { Apontamento } from '@prisma/client'

interface FetchAllApontamentoLoteUseCaseResponse {
  apontamentos: Apontamento[]
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
