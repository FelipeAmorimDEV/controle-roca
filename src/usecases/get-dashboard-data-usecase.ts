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

interface GetDashboardDataUseCaseParams {
  fazenda_id: string
}

export class GetDashboardDataUseCase {
  constructor(
    private productRepository: ProductsRepository,
    private stockRepository: StockRepository,
    private colheitaRepository: ColheitaRepository,
  ) {}

  async execute({
    fazenda_id,
  }: GetDashboardDataUseCaseParams): Promise<GetDashboardDataUseCaseResponse> {
    const totalProduto =
      await this.productRepository.getTotalProduct(fazenda_id)
    const totalEntrada = await this.stockRepository.getTotalEntrada(fazenda_id)
    const totalSaida = await this.stockRepository.getTotalSaida(fazenda_id)
    const totalEmStock =
      await this.productRepository.getPriceProductInStock(fazenda_id)
    const colheitaMes =
      await this.colheitaRepository.getProducaoMensal(fazenda_id)
    const estoqueBaixo =
      await this.productRepository.getProductLowStock(fazenda_id)

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
