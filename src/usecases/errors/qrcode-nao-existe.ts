export class QrcodeNaoExiste extends Error {
  constructor() {
    super('Qrcode não existe.')
  }
}
