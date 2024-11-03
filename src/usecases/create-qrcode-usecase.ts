import { FuncionarioRepository } from '@/repository/funcionario-repository'
import { QrcodeRepository } from '@/repository/qrcode-repository'

import QRcode from 'qrcode'
import { FuncionarioNaoExiste } from './errors/funcionario-nao-existe'

interface CreateQrcodeUseCaseParams {
  funcionarioId: string
  quantidade: number
  fazenda_id: string
}

interface CreateQrcodeUseCaseResponse {
  qrcodes: string[]
}

export class CreateQrcodeUseCase {
  constructor(
    private qrcodeRepository: QrcodeRepository,
    private funcionarioRepository: FuncionarioRepository,
  ) {}

  async execute({
    funcionarioId,
    quantidade,
    fazenda_id,
  }: CreateQrcodeUseCaseParams): Promise<CreateQrcodeUseCaseResponse> {
    const funcionario = await this.funcionarioRepository.findFuncionarioById(
      funcionarioId,
      fazenda_id,
    )

    if (!funcionario) {
      throw new FuncionarioNaoExiste()
    }

    const qrcodes = []

    for (let index = 0; index < quantidade; index++) {
      const qrcode = await this.qrcodeRepository.createQrcode({
        funcionarioId,
        fazenda_id,
      })
      const qrcodeData = {
        nome: funcionario.nome,
        qrcodeId: qrcode.id,
        funcionarioId: funcionario.id,
      }

      const qrcodeString = JSON.stringify(qrcodeData)
      const qrcodeUrl = await QRcode.toDataURL(qrcodeString)

      qrcodes.push(qrcodeUrl)
    }

    return { qrcodes }
  }
}
