import { ColheitaRepository } from '@/repository/colheita-repository'
import { Colheita } from '@prisma/client'

interface CreateColheitaUseCaseParams {
  pesoCaixa: number
  pesoTotal: number
  qntCaixa: number
  tipoCaixa: number
  setorId: string
  data: string
  variedade: string
}

interface CreateColheitaUseCaseResponse {
  colheita: Colheita
}

export class CreateColheitaUseCase {
  constructor(private colheitaRepository: ColheitaRepository) {}

  async execute({
    pesoCaixa,
    pesoTotal,
    qntCaixa,
    setorId,
    tipoCaixa,
    data,
    variedade,
  }: CreateColheitaUseCaseParams): Promise<CreateColheitaUseCaseResponse> {
    const colheita = await this.colheitaRepository.createColheita({
      pesoCaixa,
      pesoTotal,
      qntCaixa,
      setorId,
      caixa_id: tipoCaixa,
      createdAt: data,
      variedade,
    })

    return { colheita }
  }
}
