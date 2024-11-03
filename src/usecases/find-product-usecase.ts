/* eslint-disable no-useless-constructor */
import { ProductsRepository } from '@/repository/products-repository'
import { Product } from '@prisma/client'
import { ResouceNotFoundError } from './errors/resource-not-found'

interface FindProductUsecaseParams {
  id: string
  fazenda_id: string
}
interface FindProductUsecaseResponse {
  product: Product
}

export class FindProductUsecase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({
    id,
    fazenda_id,
  }: FindProductUsecaseParams): Promise<FindProductUsecaseResponse> {
    const product = await this.productsRepository.findProduct(id, fazenda_id)

    if (!product) {
      throw new ResouceNotFoundError()
    }

    return { product }
  }
}
