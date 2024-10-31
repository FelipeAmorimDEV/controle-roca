import { Pallets } from '@prisma/client'

import { QrcodePalletRepository } from '@/repository/pallet-repository'
import { PalletNaoExiste } from './errors/pallet-nao-existe'
import { PalletIndisponivel } from './errors/pallet-indisponivel'

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

    if (!qrcodeExist) {
      throw new PalletNaoExiste()
    }

    if (qrcodeExist.usado) {
      throw new PalletIndisponivel()
    }

    const qrcode = await this.qrcodePalletRepository.changeQrcodePalletUsado(
      qrcodeExist.id,
    )

    return { qrcode }
  }
}
