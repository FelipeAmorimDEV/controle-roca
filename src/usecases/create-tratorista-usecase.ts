/* eslint-disable no-useless-constructor */
import { Tratorista } from '@prisma/client'
import { TratoristaRepository } from '@/repository/tratorista-repository'

interface CreateTratoristaUseCaseParams {
  name: string
}

interface CreateTratoristaUseCaseResponse {
  tratorista: Tratorista
}

export class CreateTratoristaUseCase {
  constructor(private tratoristaRepository: TratoristaRepository) {}

  async execute({
    name,
  }: CreateTratoristaUseCaseParams): Promise<CreateTratoristaUseCaseResponse> {
    const tratorista = await this.tratoristaRepository.createTratorista({
      name,
    })

    return { tratorista }
  }
}
