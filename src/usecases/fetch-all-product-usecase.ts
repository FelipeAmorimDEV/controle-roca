/* eslint-disable no-useless-constructor */
import { ProductsRepository } from '@/repository/products-repository'
import { Product } from '@prisma/client'

interface FetchAllProductsUseCaseParams {
  q?: string
  all?: boolean
  page: number
  perPage: number
}

interface FetchAllProductsUseCaseResponse {
  products: Product[]
  total: number
  totalEstoque?: number
}

export class FetchAllProductsUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({
    q,
    page,
    all,
    perPage,
  }: FetchAllProductsUseCaseParams): Promise<FetchAllProductsUseCaseResponse> {
    const { products, total, totalEstoque } =
      await this.productsRepository.fetchAllProduct(page, perPage, q, all)

    return { products, total, totalEstoque }
  }
}
