import { QrcodeRepository } from '@/repository/qrcode-repository'
import { Qrcodes } from '@prisma/client'

import { QrcodeNaoExiste } from './errors/qrcode-nao-existe'
import { QrcodeUtilizado } from './errors/qrcode-utilizado'
import { QrcodePalletRepository } from '@/repository/pallet-repository'
import { PalletCheio } from './errors/pallet-cheio'
import { ColheitaRepository } from '@/repository/colheita-repository'
import { VariedadeRepository } from '@/repository/variedade-repository'

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
    private variedadeRepository: VariedadeRepository,
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

    const variedade = await this.variedadeRepository.findById(
      pallet.variedadeId,
    )
    const isPalletFull = pallet.qtdCaixas === pallet.qtdFeitas
    const isLastBox = pallet.qtdFeitas + 1 === pallet.qtdCaixas

    if (isLastBox) {
      const dateToday = new Date().toISOString().split('T')[0]
      await this.colheitaRepository.createColheita({
        pesoCaixa: pallet.peso / 1000,
        pesoTotal: (pallet.peso / 1000) * pallet.qtdCaixas,
        qntCaixa: pallet.qtdCaixas,
        setorId: pallet.setor_id,
        caixa_id: pallet.caixaId,
        createdAt: dateToday,
        variedade: variedade!.nome,
      })

      await this.qrcodePalletRepository.finalizarPallet(pallet.id)
    }

    if (isPalletFull) {
      throw new PalletCheio()
    }

    await this.qrcodePalletRepository.incrementPalletCaixa(pallet.id)

    const qrcode = await this.qrcodeRepository.changeQrcodeUsado(qrcoded.id)
    await this.qrcodePalletRepository.vincularCaixaAoPallet(
      pallet.id,
      qrcoded.id,
    )

    return { qrcode }
  }
}
