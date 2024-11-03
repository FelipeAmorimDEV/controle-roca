import { FuncionarioRepository } from '@/repository/funcionario-repository'
import { Funcionario } from '@prisma/client'

interface FetchAllFuncionariosWithQrcodeUseCaseParams {
  q?: string
  initialDate: string
  endDate: string
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
  }: FetchAllFuncionariosWithQrcodeUseCaseParams): Promise<FetchAllFuncionariosWithQrcodeUseCaseResponse> {
    const funcionarios =
      await this.funcionarioRepository.fetchAllFuncionariosWithQrcodes(q)

    return { funcionarios }
  }
}
