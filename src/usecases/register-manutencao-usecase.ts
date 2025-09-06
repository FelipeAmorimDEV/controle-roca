import { ManutencaoRepository } from '@/repository/manutencao-repository'
import { TipoManutencao, StatusManutencao, Manutencao } from '@prisma/client'

interface RegisterManutencaoUseCaseParams {
  tratarId: string
  tipo: TipoManutencao
  descricao: string
  custo: number
  mecanico: string
  status?: StatusManutencao
  observacoes?: string
  fazenda_id: string
}

export class RegisterManutencaoUseCase {
  constructor(private manutencaoRepository: ManutencaoRepository) {}

  async execute(params: RegisterManutencaoUseCaseParams): Promise<Manutencao> {
    return await this.manutencaoRepository.create(params)
  }
}