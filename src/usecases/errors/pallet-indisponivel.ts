export class PalletIndisponivel extends Error {
  constructor() {
    super('O Pallet já foi registrado.')
  }
}
