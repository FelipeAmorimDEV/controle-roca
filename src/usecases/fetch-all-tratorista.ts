/* eslint-disable no-useless-constructor */

import { TratoristaRepository } from '@/repository/tratorista-repository'
import { Tratorista } from '@prisma/client'

interface FetchAllTratoristaUseCaseResponse {
  tratoristas: Tratorista[]
}

export class FetchAllTratoristaUseCase {
  constructor(private tratoristaRepository: TratoristaRepository) {}

  async execute(): Promise<FetchAllTratoristaUseCaseResponse> {
    const tratoristas = await this.tratoristaRepository.fetchAllTratorista()

    return { tratoristas }
  }
}
