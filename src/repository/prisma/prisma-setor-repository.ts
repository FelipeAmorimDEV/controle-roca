import { Prisma, Setor } from '@prisma/client'
import { prisma } from '@/prisma'
import { SetorRepository } from '../setor-repository'
import dayjs from 'dayjs'

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
  async fetchAllApontamentosFiscal(
    fazendaId: string,
  ): Promise<ApontamentosI[]> {
    const apontamentos = await prisma.apontamento.findMany({
      where: {
        fazenda_id: fazendaId,
        status: 'em andamento',
        data_inicio: {
          gte: dayjs().startOf('date').toDate(),
          lte: dayjs().endOf('date').toDate(),
        },
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
        meta: apontamento.meta,
        qtd_tarefa: apontamento.qtd_tarefa,
        custo_tarefa: apontamento.custo_tarefa,
        duracao: apontamento.data_fim
          ? apontamento.data_fim.getTime() - apontamento.data_inicio.getTime()
          : null,
        setor: apontamento.setor,
      }

      return obj
    })

    return relatorio
  }

  async getCentroCusto(
    fazendaId: string,
    initialDate: string,
    endDate: string,
  ) {
    const endDateOfTheDay = new Date(endDate)
    endDateOfTheDay.setUTCHours(23, 59, 59, 999)

    const setores = await prisma.setor.findMany({
      where: {
        fazenda_id: fazendaId,
      },
      include: {
        Apontamento: {
          where: {
            data_inicio: {
              gte: new Date(initialDate),
              lte: new Date(endDateOfTheDay),
            },
          },
        },
        Saida: {
          where: {
            createdAt: {
              gte: new Date(initialDate),
              lte: new Date(endDateOfTheDay),
            },
          },
        },
      },
    })

    const relatorio = setores.map((setor) => {
      // Calcula o custo total de materiais somando os preços em cada saída associada ao setor
      const custoTotalMaterial = setor.Saida.reduce(
        (acc, saida) => acc + (saida.priceSaida || 0),
        0,
      )

      // Calcula o custo total de mão de obra somando os custos de tarefa em cada apontamento associado ao setor
      const custoTotalMaoDeObra = setor.Apontamento.reduce(
        (acc, apontamento) => acc + (apontamento.custo_tarefa || 0),
        0,
      )

      return {
        setor: setor.setorName,
        custoTotalMaterial,
        custoTotalMaoDeObra,
        custoTotal: custoTotalMaterial + custoTotalMaoDeObra,
      }
    })

    return relatorio
  }

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
        meta: apontamento.meta,
        qtd_tarefa: apontamento.qtd_tarefa,
        custo_tarefa: apontamento.custo_tarefa,
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
      include: {
        variedade: {
          select: {
            nome: true,
          },
        },
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
