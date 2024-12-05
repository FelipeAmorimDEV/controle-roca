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

    // Filtrar setores com tamanhoArea > 0 e identificar o setor GERAL
    const setoresValidos = setores.filter((setor) => setor.tamanhoArea > 0)
    const setorGeral = setores.find((setor) => setor.setorName === 'GERAL')

    if (!setorGeral) {
      throw new Error('Setor GERAL não encontrado!')
    }

    // Calcular o custo total do setor GERAL
    const custoTotalGeralMaterial = setorGeral.Saida.reduce(
      (acc, saida) => acc + (saida.priceSaida || 0),
      0,
    )
    const custoTotalGeralMaoDeObra = setorGeral.Apontamento.reduce(
      (acc, apontamento) => acc + (apontamento.custo_tarefa || 0),
      0,
    )
    const custoTotalGeral = custoTotalGeralMaterial + custoTotalGeralMaoDeObra

    // Soma do tamanho das áreas de setores válidos
    const totalTamanhoArea = setoresValidos.reduce(
      (acc, setor) => acc + setor.tamanhoArea,
      0,
    )

    console.log('Tamanho total:', totalTamanhoArea)

    // Criar o relatório
    const relatorio = setoresValidos.map((setor) => {
      // Cálculo de custo do setor
      const custoTotalMaterial = setor.Saida.reduce(
        (acc, saida) => acc + (saida.priceSaida || 0),
        0,
      )
      const custoTotalMaoDeObra = setor.Apontamento.reduce(
        (acc, apontamento) => acc + (apontamento.custo_tarefa || 0),
        0,
      )
      const custoTotal = custoTotalMaterial + custoTotalMaoDeObra

      // Cálculo da proporção do custo GERAL para este setor
      const proporcaoGeral = setor.tamanhoArea / totalTamanhoArea
      const custoGeralProporcional = custoTotalGeral * proporcaoGeral

      // Cálculo final do custo total
      return {
        setor: setor.setorName,
        custoTotalMaterial,
        custoTotalMaoDeObra,
        custoGeralProporcional,
        custoTotal: custoTotal + custoGeralProporcional,
      }
    })

    return relatorio
  }

  async fetchAllApontamentos(
    fazendaId: string,
    initialDate: string,
    endDate: string,
    page: number,
    perPage: number,
    setorId?: string,
    atividadeId?: string,
  ): Promise<ApontamentosI[]> {
    const startOfDay = dayjs(initialDate).startOf('date').toDate()
    const endOfDay = dayjs(endDate).endOf('date').toDate()

    const apontamentos = await prisma.apontamento.findMany({
      where: {
        fazenda_id: fazendaId,
        data_inicio: {
          gte: startOfDay,
          lte: endOfDay,
        },
        setor_id: setorId,
        atividade_id: atividadeId,
      },
      include: {
        atividade: true,
        funcionario: true,
        setor: true,
      },
      skip: (page - 1) * perPage,
      take: perPage,
      orderBy: {
        data_inicio: 'desc',
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
