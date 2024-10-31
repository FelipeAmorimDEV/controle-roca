import QRcode from 'qrcode'
import { QrcodePalletRepository } from '@/repository/pallet-repository'

interface CreateQrcodePalletUseCaseParams {
  quantidade: number
  qtdCaixas: number
  variedadeId: number
  peso: number
  caixaId: number
}

interface CreateQrcodePalletUseCaseResponse {
  qrcodes: string[]
}

export class CreateQrcodePalletUseCase {
  constructor(private qrcodePalletRepository: QrcodePalletRepository) {}

  async execute({
    caixaId,
    peso,
    qtdCaixas,
    variedadeId,
    quantidade,
  }: CreateQrcodePalletUseCaseParams): Promise<CreateQrcodePalletUseCaseResponse> {
    const qrcodes = []

    for (let index = 0; index < quantidade; index++) {
      const qrcode = await this.qrcodePalletRepository.createQrcodePallet({
        caixaId,
        peso,
        qtdCaixas,
        variedadeId,
      })
      const qrcodeData = {
        palletId: qrcode.id,
      }

      const qrcodeString = JSON.stringify(qrcodeData)
      const qrcodeUrl = await QRcode.toDataURL(qrcodeString)

      qrcodes.push(qrcodeUrl)
    }

    return { qrcodes }
  }
}
