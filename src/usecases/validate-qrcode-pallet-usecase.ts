import { Pallets } from '@prisma/client'

import { QrcodePalletRepository } from '@/repository/pallet-repository'
import { PalletNaoExiste } from './errors/pallet-nao-existe'

export interface QrcodeI {
  palletId: string
}

interface ValidateQrcodePalletUseCaseParams {
  qrCodeData: QrcodeI
}

interface ValidateQrcodePalletUseCaseResponse {
  qrcode: Pallets | null
}

export class ValidateQrcodePalletUseCase {
  constructor(private qrcodePalletRepository: QrcodePalletRepository) {}

  async execute({
    qrCodeData,
  }: ValidateQrcodePalletUseCaseParams): Promise<ValidateQrcodePalletUseCaseResponse> {
    const qrcodeExist = await this.qrcodePalletRepository.findPalletQrcodeById(
      qrCodeData.palletId,
    )

    console.log('pallet', qrcodeExist)

    if (!qrcodeExist) {
      throw new PalletNaoExiste()
    }

    const qrcode = await this.qrcodePalletRepository.changeQrcodePalletUsado(
      qrcodeExist.id,
    )

    return { qrcode }
  }
}
