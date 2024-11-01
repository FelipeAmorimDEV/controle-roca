import { QrcodeRepository } from '@/repository/qrcode-repository'
import { Qrcodes } from '@prisma/client'

import { QrcodeNaoExiste } from './errors/qrcode-nao-existe'
import { QrcodeUtilizado } from './errors/qrcode-utilizado'
import { QrcodePalletRepository } from '@/repository/pallet-repository'
import { PalletCheio } from './errors/pallet-cheio'
import { ColheitaRepository } from '@/repository/colheita-repository'

export interface QrcodeI {
  nome: string
  qrcodeId: string
  funcionarioId: string
}

interface ValidateQrcodeUseCaseParams {
  qrCodeData: QrcodeI
  palletId: string
}

interface ValidateQrcodeUseCaseResponse {
  qrcode: Qrcodes | null
}

export class ValidateQrcodeUseCase {
  constructor(
    private qrcodeRepository: QrcodeRepository,
    private qrcodePalletRepository: QrcodePalletRepository,
    private colheitaRepository: ColheitaRepository,
  ) {}

  async execute({
    qrCodeData,
    palletId,
  }: ValidateQrcodeUseCaseParams): Promise<ValidateQrcodeUseCaseResponse> {
    const pallet =
      await this.qrcodePalletRepository.findPalletQrcodeById(palletId)
    const qrcoded = await this.qrcodeRepository.findQrcodeById(
      qrCodeData.qrcodeId,
    )

    if (!pallet || !qrcoded) {
      throw new QrcodeNaoExiste()
    }

    if (qrcoded.usado) {
      throw new QrcodeUtilizado()
    }

    const palletIsFull = pallet.qtdCaixas === pallet.qtdFeitas

    if (palletIsFull) {
      throw new PalletCheio()
    }

    await this.colheitaRepository.createColheita({
      caixa_id: pallet.caixaId,
      pesoCaixa: pallet.peso,
      pesoTotal: pallet.peso * pallet.qtdCaixas,
      qntCaixa: pallet.qtdCaixas,
      setorId: pallet.setor_id,
    })

    await this.qrcodePalletRepository.incrementPalletCaixa(pallet.id)

    const qrcode = await this.qrcodeRepository.changeQrcodeUsado(qrcoded.id)
    await this.qrcodePalletRepository.vincularCaixaAoPallet(
      pallet.id,
      qrcoded.id,
    )

    return { qrcode }
  }
}
