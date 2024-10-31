import { FuncionarioRepository } from '@/repository/funcionario-repository'
import { Funcionario } from '@prisma/client'

interface FetchAllFuncionariosUseCaseResponse {
  funcionarios: Funcionario[]
}

export class FetchAllFuncionariosUseCase {
  constructor(private funcionarioRepository: FuncionarioRepository) {}

  async execute(): Promise<FetchAllFuncionariosUseCaseResponse> {
    const funcionarios = await this.funcionarioRepository.fetchAllFuncionarios()

    return { funcionarios }
  }
}
