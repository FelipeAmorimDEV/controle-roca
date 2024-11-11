import { Aplicacao } from '@prisma/client'

export interface CreateAplicacao {
  aplicador: string
  volumeCalda: number
  setorId: string
  produtosAplicados: {
    produto: string
    dosagem: number
    total: number
  }[]
  fazenda_id: string
}

interface FetchAplicacoes {
  aplicacoes: Aplicacao[]
  totalAplicacoes: number
}

export interface AplicacaoRepository {
  createAplicacao(data: CreateAplicacao): Promise<Aplicacao>
  fetchAplicacao(
    fazendaId: string,
    initialDate: string,
    endDate: string,
    perPage: number,
    page: number,
    setorId?: string,
  ): Promise<FetchAplicacoes>
  delete(aplicacaoId: string): Promise<Aplicacao>
}
