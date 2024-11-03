import { AtividadeRepository } from '@/repository/atividade-repository'
import { Atividade } from '@prisma/client'

interface FetchAtividadeUseCaseResponse {
  atividades: Atividade[]
}
interface FetchAtividadeUseCaseProps {
  fazenda_id: string
}

export class FetchAtividadeUseCase {
  constructor(private atividadeRepository: AtividadeRepository) {}

  async execute({
    fazenda_id,
  }: FetchAtividadeUseCaseProps): Promise<FetchAtividadeUseCaseResponse> {
    const atividades = await this.atividadeRepository.fetchAtividade(fazenda_id)

    return { atividades }
  }
}
