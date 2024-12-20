import { FuncionarioRepository } from '@/repository/funcionario-repository'

export type ListaBonus = {
  name: string
  valor_extra: number
}

interface FetchValorBonusColaboradorRequest {
  fazendaId: string
  startDate: string
  endDate: string
}

interface FetchValorBonusColaboradorResponse {
  listaDeBonus: ListaBonus[]
}

export class FetchValorBonusColaborador {
  constructor(private funcionariosRepository: FuncionarioRepository) {}
  async execute({
    fazendaId,
    startDate,
    endDate,
  }: FetchValorBonusColaboradorRequest): Promise<FetchValorBonusColaboradorResponse> {
    const listaDeBonus =
      await this.funcionariosRepository.fetchAllValorBonusByFuncionario(
        fazendaId,
        startDate,
        endDate,
      )

    return { listaDeBonus }
  }
}
