import { TratorRepository, FetchTratores } from '@/repository/trator-repository'

interface FetchTratoresUseCaseParams {
  fazenda_id: string
}

export class FetchTratoresUseCase {
  constructor(private tratorRepository: TratorRepository) {}

  async execute({ fazenda_id }: FetchTratoresUseCaseParams): Promise<FetchTratores> {
    return await this.tratorRepository.fetchByFazenda(fazenda_id)
  }
}