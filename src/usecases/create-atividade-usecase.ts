import { AtividadeRepository } from '@/repository/atividade-repository'
import { Atividade } from '@prisma/client'

interface CreateAtividadeUseCaseParams {
  nome: string
  categoria: string
  fazenda_id: string
}

interface CreateAtividadeUseCaseResponse {
  atividade: Atividade
}

export class CreateAtividadeUseCase {
  constructor(private atividadeRepository: AtividadeRepository) {}

  async execute({
    nome,
    categoria,
    fazenda_id,
  }: CreateAtividadeUseCaseParams): Promise<CreateAtividadeUseCaseResponse> {
    const atividade = await this.atividadeRepository.createAtividade({
      nome,
      categoria,
      fazenda_id,
    })

    return { atividade }
  }
}
