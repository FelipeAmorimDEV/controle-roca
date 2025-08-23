/* eslint-disable no-useless-constructor */
import { ApontamentosI } from '@/repository/prisma/prisma-setor-repository'
import { SetorRepository } from '@/repository/setor-repository'

interface FetchAllApontamentoUseCaseResponse {
  apontamentos: ApontamentosI[]
}

interface FetchAllApontamentoUseCaseParams {
  setorId?: string
  fazenda_id: string
}

export class FetchAllApontamentoUseCase {
  constructor(private setorRepository: SetorRepository) {}

  async execute({
    fazenda_id,
  }: FetchAllApontamentoUseCaseParams): Promise<FetchAllApontamentoUseCaseResponse> {
    const apontamentos =
      await this.setorRepository.fetchAllApontamentosHome(fazenda_id)

    return { apontamentos }
  }
}

// fix lote
