import {
  ColheitaRepository,
  IProducaoMensal,
} from '@/repository/colheita-repository'
import { ProductsRepository } from '@/repository/products-repository'
import { StockRepository } from '@/repository/stock-repository'
import { Product } from '@prisma/client'

interface GetDashboardDataUseCaseResponse {
  totalProduto: number
  totalSaida: number
  totalEntrada: number
  totalEmStock: number
  colheitaMes: IProducaoMensal[]
  estoqueBaixo: Product[]
}

export class GetDashboardDataUseCase {
  constructor(
    private productRepository: ProductsRepository,
    private stockRepository: StockRepository,
    private colheitaRepository: ColheitaRepository,
  ) {}

  async execute(): Promise<GetDashboardDataUseCaseResponse> {
    const totalProduto = await this.productRepository.getTotalProduct()
    const totalEntrada = await this.stockRepository.getTotalEntrada()
    const totalSaida = await this.stockRepository.getTotalSaida()
    const totalEmStock = await this.productRepository.getPriceProductInStock()
    const colheitaMes = await this.colheitaRepository.getProducaoMensal()
    const estoqueBaixo = await this.productRepository.getProductLowStock()

    return {
      totalProduto,
      totalEntrada,
      totalSaida,
      totalEmStock,
      colheitaMes,
      estoqueBaixo,
    }
  }
}
