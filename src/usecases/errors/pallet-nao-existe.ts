export class PalletNaoExiste extends Error {
  constructor() {
    super('Pallet não existe.')
  }
}
