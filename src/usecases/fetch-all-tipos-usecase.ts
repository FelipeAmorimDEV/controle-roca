/* eslint-disable no-useless-constructor */

import { TipoRepository } from '@/repository/tipo-repository'
import { Tipo } from '@prisma/client'

interface FetchAllTiposUseCaseResponse {
  tipos: Tipo[]
}

interface FetchAllTiposUseCaseParams {
  fazendaId: string
}

export class FetchAllTiposUseCase {
  constructor(private tiposRepository: TipoRepository) {}

  async execute({
    fazendaId,
  }: FetchAllTiposUseCaseParams): Promise<FetchAllTiposUseCaseResponse> {
    const tipos = await this.tiposRepository.fetchAllTipos(fazendaId)

    return { tipos }
  }
}
