import { Prisma, Setor } from '@prisma/client'
import { prisma } from '@/prisma'
import { SetorRepository } from '../setor-repository'

interface Funcionario {
  id: string
  nome: string
}

interface Atividade {
  atividadeId: string
  nomeAtividade: string
  categoria: string
  dataInicio: Date
  dataFim: Date | null
  duracao: number | null
  funcionario: Funcionario
}

export interface LoteRelatorio {
  loteId: string
  nomeLote: string
  tamanho: number
  tipoVinha: string
  atividades: Atividade[]
}

interface SetorI {
  id: string
  setorName: string
  filas: string
  variedade_id: number
  tamanhoArea: number
}

export interface ApontamentosI {
  id: string
  status: string
  data_inicio: Date
  data_fim: Date | null
  atividade: string
  funcionario: string
  duracao: number | null
  setor: SetorI
}

export class PrismaSetorRepository implements SetorRepository {
  async fetchAllApontamentos(fazendaId: string): Promise<ApontamentosI[]> {
    const apontamentos = await prisma.apontamento.findMany({
      where: {
        fazenda_id: fazendaId,
      },
      include: {
        atividade: true,
        funcionario: true,
        setor: true,
      },
    })

    const relatorio = apontamentos.map((apontamento) => {
      const obj = {
        id: apontamento.id,
        status: apontamento.status,
        data_inicio: apontamento.data_inicio,
        data_fim: apontamento.data_fim,
        atividade: apontamento.atividade.nome,
        funcionario: apontamento.funcionario.nome,
        duracao: apontamento.data_fim
          ? apontamento.data_fim.getTime() - apontamento.data_inicio.getTime()
          : null,
        setor: apontamento.setor,
      }

      return obj
    })

    return relatorio
  }

  async fetchAllSetor(fazendaId: string): Promise<Setor[]> {
    const setores = prisma.setor.findMany({
      where: {
        fazenda_id: fazendaId,
      },
      orderBy: {
        setorName: 'asc',
      },
    })

    return setores
  }

  async createSetor(data: Prisma.SetorUncheckedCreateInput) {
    const setor = prisma.setor.create({
      data: {
        filas: data.filas,
        setorName: data.setorName,
        variedade_id: data.variedade_id,
        tamanhoArea: data.tamanhoArea,
        fazenda_id: data.fazenda_id,
      },
    })

    return setor
  }
}
