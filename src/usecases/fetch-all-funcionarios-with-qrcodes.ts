import { FuncionarioRepository } from '@/repository/funcionario-repository'
import { Funcionario } from '@prisma/client'

interface FetchAllFuncionariosWithQrcodeUseCaseParams {
  q?: string
  initialDate: string
  endDate: string
  fazenda_id: string
}

interface FetchAllFuncionariosWithQrcodeUseCaseResponse {
  funcionarios: Funcionario[]
}

export class FetchAllFuncionariosWithQrcodeUseCase {
  constructor(private funcionarioRepository: FuncionarioRepository) {}

  async execute({
    q,
    endDate,
    initialDate,
    fazenda_id,
  }: FetchAllFuncionariosWithQrcodeUseCaseParams): Promise<FetchAllFuncionariosWithQrcodeUseCaseResponse> {
    const funcionarios =
      await this.funcionarioRepository.fetchAllFuncionariosWithQrcodes(
        initialDate,
        endDate,
        fazenda_id,
        q,
      )

    return { funcionarios }
  }
}
