/* eslint-disable no-useless-constructor */

import { TipoRepository } from '@/repository/tipo-repository'
import { Tipo } from '@prisma/client'

interface FetchAllTiposUseCaseResponse {
  tipos: Tipo[]
}

export class FetchAllTiposUseCase {
  constructor(private tiposRepository: TipoRepository) {}

  async execute(): Promise<FetchAllTiposUseCaseResponse> {
    const tipos = await this.tiposRepository.fetchAllTipos()

    return { tipos }
  }
}
