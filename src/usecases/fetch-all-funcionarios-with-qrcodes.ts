import { FuncionarioRepository } from '@/repository/funcionario-repository'
import { Funcionario } from '@prisma/client'

interface FetchAllFuncionariosWithQrcodeUseCaseParams {
  q?: string
}

interface FetchAllFuncionariosWithQrcodeUseCaseResponse {
  funcionarios: Funcionario[]
}

export class FetchAllFuncionariosWithQrcodeUseCase {
  constructor(private funcionarioRepository: FuncionarioRepository) {}

  async execute({
    q,
  }: FetchAllFuncionariosWithQrcodeUseCaseParams): Promise<FetchAllFuncionariosWithQrcodeUseCaseResponse> {
    const funcionarios =
      await this.funcionarioRepository.fetchAllFuncionariosWithQrcodes(q)

    return { funcionarios }
  }
}
