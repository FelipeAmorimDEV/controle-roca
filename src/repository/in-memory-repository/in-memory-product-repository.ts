import { Prisma, Product } from '@prisma/client'
import { ProductsRepository } from '../products-repository'

export class InMemoryProductRepository implements ProductsRepository {
  public products: Product[] = []

  async decrementProductQuantity(quantity: number, productId: string) {
    const product = this.products.find((product) => product.id === productId)!

    const quantidade = product.quantity - quantity

    product.quantity = quantidade

    return product
  }

  async incrementProductQuantity(quantity: number, productId: string) {
    const product = this.products.find((product) => product.id === productId)!

    const quantidade = product.quantity + quantity

    product.quantity = quantidade

    return product
  }

  async putQuantity(quantity: number, productId: string) {
    const product = this.products.find((product) => product.id === productId)!

    const quantidade = product.quantity + quantity

    product.quantity = quantidade

    return product
  }

  async findProduct(id: string) {
    const product = this.products.find((product) => product.id === id)

    if (!product) {
      return null
    }

    return product
  }

  async fetchAllProduct() {
    return this.products
  }

  async createProduct(data: Prisma.ProductCreateManyInput) {
    const product = {
      id: crypto.randomUUID(),
      name: data.name,
      price: data.price,
      quantity: data.quantity,
      unit: data.unit,
    }
    this.products.push(product)

    return product
  }
}
