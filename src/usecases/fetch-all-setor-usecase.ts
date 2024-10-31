/* eslint-disable no-useless-constructor */
import { SetorRepository } from '@/repository/setor-repository'
import { Setor } from '@prisma/client'

interface FetchAllSetorUseCaseResponse {
  setores: Setor[]
}

export class FetchAllSetorUseCase {
  constructor(private setorRepository: SetorRepository) {}

  async execute(): Promise<FetchAllSetorUseCaseResponse> {
    const setores = await this.setorRepository.fetchAllSetor()

    return { setores }
  }
}
