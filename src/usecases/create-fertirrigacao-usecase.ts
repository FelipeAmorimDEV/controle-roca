import { FertirrigacaoRepository } from '@/repository/fertirrigacao-repository'
import { ProductsRepository } from '@/repository/products-repository'
import { StockRepository } from '@/repository/stock-repository'
import { Fertirrigacao } from '@prisma/client'
import { QuantidadeIndisponivel } from './errors/quantidade-indiponivel'

export interface ProdutosNotaFiscalS {
  produtoId: string
  quantidade: number
}

interface CreateFertirrigacaoUseCaseParams {
  aplicadorId: string
  setorId: string
  semana: string
  produtos: ProdutosNotaFiscalS[]
  user_id: string
  fazenda_id: string
}

interface CreateFertirrigacaoUseCaseResponse {
  fertirrigacao: Fertirrigacao
}

export class CreateFertirrigacaoUseCase {
  constructor(
    private fertirrigacaoRepository: FertirrigacaoRepository,
    private productRepository: ProductsRepository,
    private stockRepository: StockRepository,
  ) {}

  async execute({
    aplicadorId,
    produtos,
    semana,
    setorId,
    user_id,
    fazenda_id,
  }: CreateFertirrigacaoUseCaseParams): Promise<CreateFertirrigacaoUseCaseResponse> {
    for (let i = 0; i < produtos.length; i++) {
      const element = produtos[i]
      const product = await this.productRepository.findProduct(
        element.produtoId,
      )
      if (product) {
        const hasQuantity = (product.quantity ?? 0) >= element.quantidade

        if (!hasQuantity) {
          throw new QuantidadeIndisponivel(product.name)
        }
      }
    }

    const fertirrigacao = await this.fertirrigacaoRepository.create(
      {
        aplicador_id: aplicadorId,
        semana,
        setor_id: setorId,
        fazenda_id,
      },
      produtos,
    )

    for (let i = 0; i < produtos.length; i++) {
      const element = produtos[i]
      const product = await this.productRepository.findProduct(
        element.produtoId,
      )
      const productPrice = product?.price ?? 0

      const valorSaida = productPrice * element.quantidade
      await this.stockRepository.createWithdrawStockItemLog(
        element.quantidade,
        element.produtoId,
        setorId,
        valorSaida,
        new Date().toISOString().split('T')[0],
        user_id,
        fazenda_id,
      )

      await this.productRepository.decrementProductQuantity(
        element.quantidade,
        element.produtoId,
      )
    }

    return { fertirrigacao }
  }
}
