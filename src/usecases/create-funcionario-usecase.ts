import { FuncionarioRepository } from '@/repository/funcionario-repository'
import { Funcionario } from '@prisma/client'

interface CreateFuncionarioUseCaseParams {
  nome: string
  cargo: string
}

interface CreateFuncionarioUseCaseResponse {
  funcionario: Funcionario
}

export class CreateFuncionarioUseCase {
  constructor(private funcionarioRepository: FuncionarioRepository) {}

  async execute({
    nome,
    cargo,
  }: CreateFuncionarioUseCaseParams): Promise<CreateFuncionarioUseCaseResponse> {
    const funcionario = await this.funcionarioRepository.createFuncionario({
      nome,
      cargo,
    })

    return { funcionario }
  }
}
