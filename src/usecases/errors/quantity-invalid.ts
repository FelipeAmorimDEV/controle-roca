export class QuantityInvalidError extends Error {
  constructor(input: string) {
    super(`${input} cannot be less than one.`)
  }
}
