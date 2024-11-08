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

export interface AplicacaoRepository {
  createAplicacao(data: CreateAplicacao): Promise<Aplicacao>
  fetchAplicacao(fazendaId: string): Promise<Aplicacao[]>
  delete(aplicacaoId: string): Promise<Aplicacao>
}
