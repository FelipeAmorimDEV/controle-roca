import { Apontamento, Prisma } from '@prisma/client'
import { prisma } from '@/prisma'
import { ApontamentoRepository } from '../apontamento-repository'
import dayjs from 'dayjs'

export class PrismaApontamentoRepository implements ApontamentoRepository {
  async findOnSameDateById(funcionarioId: string, date: Date) {
    const startOfDay = dayjs(date).startOf('date').toDate()
    const endOfDay = dayjs(date).endOf('date').toDate()

    const apontamento = await prisma.apontamento.findFirst({
      where: {
        funcionario_id: funcionarioId,
        data_inicio: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    })

    return apontamento
  }

  async findById(apontamentoId: string): Promise<Apontamento | null> {
    const apontamento = await prisma.apontamento.findUnique({
      where: {
        id: apontamentoId,
      },
    })

    return apontamento
  }

  async deleteApontamento(
    apontamentoId: string,
    fazendaId: string,
  ): Promise<Apontamento> {
    const apontamento = await prisma.apontamento.delete({
      where: {
        id: apontamentoId,
        fazenda_id: fazendaId,
      },
    })

    return apontamento
  }

  async concluirApontamento(
    apontamentoId: string,
    fazendaId: string,
    dataConclusao: string,
    qtdAtividade: number,
    custoTarefa: number,
    duracao: number,
    valorBonus: number,
  ): Promise<Apontamento> {
    const apontamento = await prisma.apontamento.update({
      where: {
        id: apontamentoId,
        fazenda_id: fazendaId,
      },
      data: {
        data_fim: new Date(dataConclusao),
        status: 'concluida',
        qtd_tarefa: qtdAtividade,
        custo_tarefa: custoTarefa,
        duracao_horas: duracao,
        valor_bonus: valorBonus,
      },
    })

    return apontamento
  }

  async createApontamento(
    data: Prisma.ApontamentoUncheckedCreateInput,
  ): Promise<Apontamento> {
    const apontamento = await prisma.apontamento.create({
      data,
    })

    return apontamento
  }
}
