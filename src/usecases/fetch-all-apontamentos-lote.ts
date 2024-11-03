/* eslint-disable no-useless-constructor */
import { ApontamentosI } from '@/repository/prisma/prisma-setor-repository'
import { SetorRepository } from '@/repository/setor-repository'

interface FetchAllApontamentoLoteUseCaseResponse {
  apontamentos: ApontamentosI[]
}

interface FetchAllApontamentoLoteUseCaseParams {
  setorId?: string
  fazenda_id: string
}

export class FetchAllApontamentoLoteUseCase {
  constructor(private setorRepository: SetorRepository) {}

  async execute({
    setorId,
    fazenda_id,
  }: FetchAllApontamentoLoteUseCaseParams): Promise<FetchAllApontamentoLoteUseCaseResponse> {
    const apontamentos =
      await this.setorRepository.fetchAllApontamentos(fazenda_id)

    return { apontamentos }
  }
}

// fix lote
