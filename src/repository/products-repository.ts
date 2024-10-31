import { Product } from '@prisma/client'

export interface CreateProduct {
  name: string
  unit: string
  fornecedorId: string
  tipoId: string
}

export interface FetchAllProduct {
  products: Product[]
  total: number
  totalEstoque?: number
}

export interface ProductsRepository {
  createProduct(data: CreateProduct): Promise<Product>
  fetchAllProduct(
    page: number,
    perPage: number,
    q?: string,
    all?: boolean,
  ): Promise<FetchAllProduct>
  findProduct(id: string): Promise<Product | null>
  decrementProductQuantity(
    quantity: number,
    productId: string,
  ): Promise<Product>
  incrementProductQuantity(
    quantity: number,
    productId: string,
  ): Promise<Product>
}
