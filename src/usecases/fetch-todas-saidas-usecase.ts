/* eslint-disable no-useless-constructor */
import { StockRepository } from '@/repository/stock-repository'
import { Saida } from '@prisma/client'

interface FetchTodasSaidasUseCaseResponse {
  saidas: Saida[]
  total: number
  saidasTotal: number | null
}

interface FetchTodasSaidasUseCaseParams {
  initialDate: string
  endDate: string
  productId?: string
  setorId?: string
  page: number
  perPage: number
}

export class FetchTodasSaidasUseCase {
  constructor(private stockRepository: StockRepository) {}

  async execute({
    productId,
    setorId,
    initialDate,
    endDate,
    page,
    perPage,
  }: FetchTodasSaidasUseCaseParams): Promise<FetchTodasSaidasUseCaseResponse> {
    const { saidas, total, saidasTotal } =
      await this.stockRepository.fetchSaidas(
        initialDate,
        endDate,
        page,
        perPage,
        productId,
        setorId,
      )

    return { saidas, total, saidasTotal }
  }
}
