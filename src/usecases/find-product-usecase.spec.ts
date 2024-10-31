import { InMemoryProductRepository } from '../repository/in-memory-repository/in-memory-product-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { FindProductUsecase } from './find-product-usecase'

let productsRepository: InMemoryProductRepository
let sut: FindProductUsecase

describe('Create Product Use Case', async () => {
  beforeEach(() => {
    productsRepository = new InMemoryProductRepository()
    sut = new FindProductUsecase(productsRepository)
  })

  it('should be able to find a product', async () => {
    const { id } = await productsRepository.createProduct({
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

    const { product } = await sut.execute({ id })

    expect(product).toEqual(
      expect.objectContaining({
        id: expect.any(String),
      }),
    )
  })
})
