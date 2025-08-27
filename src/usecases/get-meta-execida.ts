// get-funcionarios-metas-excedidas-usecase.ts
import { ApontamentoRepository } from '@/repository/apontamento-repository'

interface GetFuncionariosMetasExcedidasRequest {
  fazenda_id: string
  dataInicio: Date
  dataFim: Date
}

export class GetFuncionariosMetasExcedidasUseCase {
  constructor(private apontamentoRepository: ApontamentoRepository) {}

  async execute({ fazenda_id, dataInicio, dataFim }: GetFuncionariosMetasExcedidasRequest) {
    const funcionarios = await this.apontamentoRepository.getFuncionariosMetasExcedidas(
      fazenda_id,
      dataInicio,
      dataFim
    )

    return funcionarios
  }
}
