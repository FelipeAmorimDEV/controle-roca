/* eslint-disable no-useless-constructor */
import { Aplicacao } from '@prisma/client'
import { AplicacaoRepository } from '@/repository/aplicacao-repository'
import { StockRepository } from '@/repository/stock-repository'
import { ProductsRepository } from '@/repository/products-repository'
import { QuantidadeIndisponivel } from './errors/quantidade-indiponivel'

export interface ProdutosAplicacao {
  produto: string
  dosagem: number
  total: number
}
interface CreateAplicacaoUseCaseParams {
  aplicador: string
  setorId: string
  volumeCalda: number
  produtos: ProdutosAplicacao[]
  userId: string
  fazenda_id: string
}

interface CreateAplicacaoUseCaseResponse {
  aplicacao: Aplicacao
}

export class CreateAplicacaoUseCase {
  constructor(
    private aplicacaoRepository: AplicacaoRepository,
    private stockRepository: StockRepository,
    private productRepository: ProductsRepository,
  ) {}

  async execute({
    aplicador,
    produtos,
    setorId,
    volumeCalda,
    userId,
    fazenda_id,
  }: CreateAplicacaoUseCaseParams): Promise<CreateAplicacaoUseCaseResponse> {
    for (const product of produtos) {
      const qntProduto = product.total / 1000
      const produto = await this.productRepository.findProduct(
        product.produto,
        fazenda_id,
      )

      if (produto) {
        const quantidadeEstoque = produto.quantity
        const hasQuantity = quantidadeEstoque! >= qntProduto

        if (!hasQuantity) {
          throw new QuantidadeIndisponivel(produto.name)
        }
      }
    }

    for (const product of produtos) {
      const qntProduto = product.total / 1000
      const produto = await this.productRepository.findProduct(
        product.produto,
        fazenda_id,
      )

      if (produto) {
        const createdAt = new Date().toISOString().split('T')[0]
        const priceSaida = (produto.price ?? 0) * qntProduto
        console.log(priceSaida)
        await this.stockRepository.createWithdrawStockItemLog(
          qntProduto,
          produto.id,
          setorId,
          priceSaida,
          createdAt,
          userId,
          fazenda_id,
        )

        await this.productRepository.decrementProductQuantity(
          qntProduto,
          produto.id,
          fazenda_id,
        )
      }
    }

    const aplicacao = await this.aplicacaoRepository.createAplicacao({
      aplicador,
      volumeCalda,
      setorId,
      produtosAplicados: produtos,
      fazenda_id,
    })

    return { aplicacao }
  }
}
