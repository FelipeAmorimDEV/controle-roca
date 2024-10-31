import { ColheitaRepository } from '@/repository/colheita-repository'
import { Colheita } from '@prisma/client'

interface CreateColheitaUseCaseParams {
  pesoCaixa: number
  pesoTotal: number
  qntCaixa: number
  tipoCaixa: string
  setorId: string
  data: string
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
  }: CreateColheitaUseCaseParams): Promise<CreateColheitaUseCaseResponse> {
    const colheita = await this.colheitaRepository.createColheita({
      pesoCaixa,
      pesoTotal,
      qntCaixa,
      setorId,
      tipoCaixa,
      createdAt: data,
    })

    return { colheita }
  }
}
