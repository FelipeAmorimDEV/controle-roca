import { AtividadeRepository } from '@/repository/atividade-repository'
import { Atividade } from '@prisma/client'

interface CreateAtividadeUseCaseParams {
  nome: string
  categoria: string
  fazenda_id: string
  valorBonus: number
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
    valorBonus,
  }: CreateAtividadeUseCaseParams): Promise<CreateAtividadeUseCaseResponse> {
    const atividade = await this.atividadeRepository.createAtividade({
      nome,
      categoria,
      fazenda_id,
      valor_bonus: valorBonus,
    })

    return { atividade }
  }
}
