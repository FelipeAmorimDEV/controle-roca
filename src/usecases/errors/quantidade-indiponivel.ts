export class QuantidadeIndisponivel extends Error {
  constructor(produto?: string) {
    super(`Quantidade de ${produto} indisponivel.`)
  }
}
