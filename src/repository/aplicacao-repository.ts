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
}

export interface AplicacaoRepository {
  createAplicacao(data: CreateAplicacao): Promise<Aplicacao>
  fetchAplicacao(): Promise<Aplicacao[]>
}
