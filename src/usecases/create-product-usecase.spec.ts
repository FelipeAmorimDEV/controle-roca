import { InMemoryProductRepository } from '../repository/in-memory-repository/in-memory-product-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { CreateProductUseCase } from './create-product-usecase'
import { QuantityInvalidError } from './errors/quantity-invalid'

let productsRepository: InMemoryProductRepository
let sut: CreateProductUseCase

describe('Create Product Use Case', async () => {
  beforeEach(() => {
    productsRepository = new InMemoryProductRepository()
    sut = new CreateProductUseCase(productsRepository)
  })

  it('should be able to create a product', async () => {
    const { product } = await sut.execute({
      name: 'pbz',
      price: 150,
      quantity: 16,
      unit: 'kg',
    })

    expect(product).toEqual(
      expect.objectContaining({
        id: expect.any(String),
      }),
    )
  })

  it('should not be able to create a product with wrong quantity', async () => {
    expect(() =>
      sut.execute({
        name: 'pbz',
        price: 150,
        quantity: 0,
        unit: 'kg',
      }),
    ).rejects.toBeInstanceOf(QuantityInvalidError)
  })

  it('should not be able to create a product with wrong price', async () => {
    expect(() =>
      sut.execute({
        name: 'pbz',
        price: 0,
        quantity: 1,
        unit: 'kg',
      }),
    ).rejects.toBeInstanceOf(QuantityInvalidError)
  })
})
