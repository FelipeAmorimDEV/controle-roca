import { FuncionarioRepository } from '@/repository/funcionario-repository'
import { Funcionario } from '@prisma/client'

interface CreateFuncionarioUseCaseParams {
  nome: string
  cargo: string
  fazenda_id: string
}

interface CreateFuncionarioUseCaseResponse {
  funcionario: Funcionario
}

export class CreateFuncionarioUseCase {
  constructor(private funcionarioRepository: FuncionarioRepository) {}

  async execute({
    nome,
    cargo,
    fazenda_id,
  }: CreateFuncionarioUseCaseParams): Promise<CreateFuncionarioUseCaseResponse> {
    const funcionario = await this.funcionarioRepository.createFuncionario({
      nome,
      cargo,
      fazenda_id,
    })

    return { funcionario }
  }
}
