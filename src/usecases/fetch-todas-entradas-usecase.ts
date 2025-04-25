/* eslint-disable no-useless-constructor */
import { StockRepository } from '@/repository/stock-repository'
import { Entrada } from '@prisma/client'

interface FetchTodasEntradasUseCaseResponse {
  entradas: Entrada[]
  total: number
  entradasTotal: number | null
}

interface FetchTodasEntradasUseCaseParams {
  productName?: string
  initialDate: string
  endDate: string
  page: number
  perPage: number
  fazenda_id: string
}

export class FetchTodasEntradasUseCase {
  constructor(private stockRepository: StockRepository) {}

  async execute({
    productName,
    initialDate,
    endDate,
    page,
    perPage,
    fazenda_id,
  }: FetchTodasEntradasUseCaseParams): Promise<FetchTodasEntradasUseCaseResponse> {
    const { entradas, total, entradasTotal } =
      await this.stockRepository.fetchEntradas(
        initialDate,
        endDate,
        page,
        perPage,
        fazenda_id,
        productName,
      )

    return { entradas, total, entradasTotal }
  }
}
