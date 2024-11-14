/* eslint-disable no-useless-constructor */
import { ApontamentosI } from '@/repository/prisma/prisma-setor-repository'
import { SetorRepository } from '@/repository/setor-repository'

interface FetchAllApontamentoNaoConcluidoUseCaseResponse {
  apontamentos: ApontamentosI[]
}

interface FetchAllApontamentoNaoConcluidoUseCaseParams {
  setorId?: string
  fazenda_id: string
}

export class FetchAllApontamentoNaoConcluidoUseCase {
  constructor(private setorRepository: SetorRepository) {}

  async execute({
    fazenda_id,
  }: FetchAllApontamentoNaoConcluidoUseCaseParams): Promise<FetchAllApontamentoNaoConcluidoUseCaseResponse> {
    const apontamentos =
      await this.setorRepository.fetchAllApontamentosFiscal(fazenda_id)

    return { apontamentos }
  }
}

// fix lote
