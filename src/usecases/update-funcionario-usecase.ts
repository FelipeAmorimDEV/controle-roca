import { FuncionarioRepository } from '@/repository/funcionario-repository'
import { Funcionario } from '@prisma/client'
import { ResouceNotFoundError } from './errors/resource-not-found'

interface UpdateFuncionarioUseCaseParams {
  funcionarioId: string
  cargo: string
  fazenda_id: string
  tipoContratacao: string
}

interface UpdateFuncionarioUseCaseResponse {
  funcionario: Funcionario
}

export class UpdateFuncionarioUseCase {
  constructor(private funcionarioRepository: FuncionarioRepository) {}

  async execute({
    funcionarioId,
    cargo,
    fazenda_id,
    tipoContratacao,
  }: UpdateFuncionarioUseCaseParams): Promise<UpdateFuncionarioUseCaseResponse> {
    const funcionario = await this.funcionarioRepository.findFuncionarioById(funcionarioId, fazenda_id)

    if (!funcionario) {
      throw new ResouceNotFoundError()
    }

    await this.funcionarioRepository.updateFuncionario(funcionarioId, cargo, tipoContratacao)

    return { funcionario }
  }
}
