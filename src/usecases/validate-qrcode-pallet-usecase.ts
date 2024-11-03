import { Pallets } from '@prisma/client'

import { QrcodePalletRepository } from '@/repository/pallet-repository'
import { PalletNaoExiste } from './errors/pallet-nao-existe'

export interface QrcodeI {
  palletId: string
}

interface ValidateQrcodePalletUseCaseParams {
  qrCodeData: QrcodeI
  fazenda_id: string
}

interface ValidateQrcodePalletUseCaseResponse {
  qrcode: Pallets | null
}

export class ValidateQrcodePalletUseCase {
  constructor(private qrcodePalletRepository: QrcodePalletRepository) {}

  async execute({
    qrCodeData,
    fazenda_id,
  }: ValidateQrcodePalletUseCaseParams): Promise<ValidateQrcodePalletUseCaseResponse> {
    const qrcodeExist = await this.qrcodePalletRepository.findPalletQrcodeById(
      qrCodeData.palletId,
      fazenda_id,
    )

    if (!qrcodeExist) {
      throw new PalletNaoExiste()
    }

    const qrcode = await this.qrcodePalletRepository.changeQrcodePalletUsado(
      qrcodeExist.id,
      fazenda_id,
    )

    return { qrcode }
  }
}
