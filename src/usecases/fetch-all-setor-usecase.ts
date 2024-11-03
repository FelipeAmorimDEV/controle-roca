/* eslint-disable no-useless-constructor */
import { SetorRepository } from '@/repository/setor-repository'
import { Setor } from '@prisma/client'

interface FetchAllSetorUseCaseResponse {
  setores: Setor[]
}

interface FetchAllSetorUseCaseParams {
  fazenda_id: string
}

export class FetchAllSetorUseCase {
  constructor(private setorRepository: SetorRepository) {}

  async execute({
    fazenda_id,
  }: FetchAllSetorUseCaseParams): Promise<FetchAllSetorUseCaseResponse> {
    const setores = await this.setorRepository.fetchAllSetor(fazenda_id)

    return { setores }
  }
}
