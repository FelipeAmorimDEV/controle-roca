import { PrismaFertirrigacaoRepository } from '@/repository/prisma/prisma-fertirrigacao-repository'
import { Fertirrigacao } from '@prisma/client'

interface FetchAllFertirrigacoesUseCaseResponse {
  fertirrigacoes: Fertirrigacao[]
}

interface FetchAllFertirrigacoesUseCaseParams {
  fazenda_id: string
  initialDate: string
  endDate: string
  page: number
  perPage: number
  setorId?: string
}

export class FetchAllFertirrigacoesUseCase {
  constructor(
    private fertirrigacoesRepository: PrismaFertirrigacaoRepository,
  ) {}

  async execute({
    fazenda_id,
    endDate,
    setorId,
    initialDate,
    page,
    perPage,
  }: FetchAllFertirrigacoesUseCaseParams): Promise<FetchAllFertirrigacoesUseCaseResponse> {
    const fertirrigacoes = await this.fertirrigacoesRepository.fetchMany(
      fazenda_id,
      initialDate,
      endDate,
      page,
      perPage,
      setorId,
    )

    return { fertirrigacoes }
  }
}
