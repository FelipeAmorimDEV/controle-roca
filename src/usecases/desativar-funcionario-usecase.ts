import { FuncionarioRepository } from '@/repository/funcionario-repository'
import { Funcionario } from '@prisma/client'
import { ResouceNotFoundError } from './errors/resource-not-found'

interface DesativarFuncionarioUseCaseParams {
  funcionarioId: string
  fazenda_id: string
}

export class DesativarFuncionarioUseCase {
  constructor(private funcionarioRepository: FuncionarioRepository) {}

  async execute({
  funcionarioId,
  fazenda_id
  }: DesativarFuncionarioUseCaseParams): Promise<void> {
    const funcionario = await this.funcionarioRepository.findFuncionarioById(funcionarioId, fazenda_id)

    if (!funcionario) {
      throw new ResouceNotFoundError()
    }

    await this.funcionarioRepository.desativarFuncionario(funcionarioId)
 

  }
}
