// get-funcionarios-metas-excedidas-usecase.ts
import { ApontamentoRepository } from '@/repository/apontamento-repository'

interface GetFuncionariosMetaExcedidaFiltrossRequest {
  fazenda_id: string
  dataInicio: Date
  dataFim: Date
  atividadeNome?: string
  funcionarioNome?: string
}

export class GetFuncionariosMetaExcedidaFiltrossUseCase {
  constructor(private apontamentoRepository: ApontamentoRepository) {}

  async execute({ fazenda_id, dataInicio, dataFim, atividadeNome, funcionarioNome }: GetFuncionariosMetaExcedidaFiltrossRequest) {
    const funcionarios = await this.apontamentoRepository.getFuncionariosMetasExcedidasFiltrado(fazenda_id, dataInicio, dataFim, { atividadeNome, funcionarioNome})

    return { funcionarios }
  }
}
