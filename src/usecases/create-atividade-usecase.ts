import { AtividadeRepository } from '@/repository/atividade-repository'
import { Atividade } from '@prisma/client'

interface CreateAtividadeUseCaseParams {
  nome: string
  categoria: string
}

interface CreateAtividadeUseCaseResponse {
  atividade: Atividade
}

export class CreateAtividadeUseCase {
  constructor(private atividadeRepository: AtividadeRepository) {}

  async execute({
    nome,
    categoria,
  }: CreateAtividadeUseCaseParams): Promise<CreateAtividadeUseCaseResponse> {
    const atividade = await this.atividadeRepository.createAtividade({
      nome,
      categoria,
    })

    return { atividade }
  }
}
