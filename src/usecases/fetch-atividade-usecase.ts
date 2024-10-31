import { AtividadeRepository } from '@/repository/atividade-repository'
import { Atividade } from '@prisma/client'

interface FetchAtividadeUseCaseResponse {
  atividades: Atividade[]
}

export class FetchAtividadeUseCase {
  constructor(private atividadeRepository: AtividadeRepository) {}

  async execute(): Promise<FetchAtividadeUseCaseResponse> {
    const atividades = await this.atividadeRepository.fetchAtividade()

    return { atividades }
  }
}
