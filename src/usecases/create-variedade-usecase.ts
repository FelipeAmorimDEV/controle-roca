import { FuncionarioRepository } from '@/repository/funcionario-repository'
import { VariedadeRepository } from '@/repository/variedade-repository'
import {  Variedade } from '@prisma/client'

interface CreateVariedadeUseCaseParams {
  nome: string
}

interface CreateVariedadeUseCaseResponse {
  variedade: Variedade
}

export class CreateVariedadeUseCase {
  constructor(private variedadeRepository: VariedadeRepository) {}

  async execute({
    nome,
  }: CreateVariedadeUseCaseParams): Promise<CreateVariedadeUseCaseResponse> {
    const variedade = await this.variedadeRepository.createVariedade({
      nome,
    })

    return { variedade }
  }
}
