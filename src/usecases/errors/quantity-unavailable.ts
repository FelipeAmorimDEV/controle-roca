export class QuantityUnavailableError extends Error {
  constructor() {
    super(`Quantidade indiponivel no estoque.`)
  }
}
