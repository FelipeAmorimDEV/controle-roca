import { FuncionarioRepository } from '@/repository/funcionario-repository'
import { Funcionario } from '@prisma/client'

interface FetchAllFuncionariosUseCaseResponse {
  funcionarios: Funcionario[]
}

interface FetchAllFuncionariosUseCaseParams {
  fazenda_id: string
}

export class FetchAllFuncionariosUseCase {
  constructor(private funcionarioRepository: FuncionarioRepository) {}

  async execute({
    fazenda_id,
  }: FetchAllFuncionariosUseCaseParams): Promise<FetchAllFuncionariosUseCaseResponse> {
    const funcionarios =
      await this.funcionarioRepository.fetchAllFuncionarios(fazenda_id)

    return { funcionarios }
  }
}
