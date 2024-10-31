import { InMemoryProductRepository } from '../repository/in-memory-repository/in-memory-product-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { FetchAllProductsUseCase } from './fetch-all-product-usecase'

let productsRepository: InMemoryProductRepository
let sut: FetchAllProductsUseCase

describe('Create Product Use Case', async () => {
  beforeEach(() => {
    productsRepository = new InMemoryProductRepository()
    sut = new FetchAllProductsUseCase(productsRepository)
  })

  it('should be able to fetch all product', async () => {
    await productsRepository.createProduct({
      id: crypto.randomUUID(),
      name: 'pbz',
      price: 150,
      quantity: 2,
      unit: 'kg',
    })

    await productsRepository.createProduct({
      id: crypto.randomUUID(),
      name: 'cutah',
      price: 120,
      quantity: 3,
      unit: 'l',
    })

    const { products } = await sut.execute()

    expect(products).toHaveLength(2)
    expect(products).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
        }),
        expect.objectContaining({
          id: expect.any(String),
        }),
      ]),
    )
  })
})
