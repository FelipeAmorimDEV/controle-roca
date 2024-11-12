/* eslint-disable no-useless-constructor */
import {
  RelatorioCentroCusto,
  SetorRepository,
} from '@/repository/setor-repository'

interface GetCentroCustoUseCaseResponse {
  setores: RelatorioCentroCusto[]
}

interface GetCentroCustoUseCaseParams {
  fazenda_id: string
  initialDate: string
  endDate: string
}
export class GetCentroCustoUseCase {
  constructor(private setorRepository: SetorRepository) {}

  async execute({
    fazenda_id,
    endDate,
    initialDate,
  }: GetCentroCustoUseCaseParams): Promise<GetCentroCustoUseCaseResponse> {
    const setores = await this.setorRepository.getCentroCusto(
      fazenda_id,
      initialDate,
      endDate,
    )

    return { setores }
  }
}
