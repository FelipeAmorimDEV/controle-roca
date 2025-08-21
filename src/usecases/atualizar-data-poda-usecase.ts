import { ColheitaRepository } from '@/repository/colheita-repository'
import { SetorRepository } from '@/repository/setor-repository'

interface AtualizaPrecoColheitaUseCaseParams {
  setorId: string
  dataPoda: Date
}

export class AtualizaDataPodaUseCase {
  constructor(private setorRepository: SetorRepository) {}

  async execute({ dataPoda, setorId}: AtualizaPrecoColheitaUseCaseParams) {
    await this.setorRepository.registrarNovaPoda(setorId, dataPoda)
  }
}
