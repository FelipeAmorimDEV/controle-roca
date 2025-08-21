import { Funcionario, Prisma } from '@prisma/client'
import {
  FuncionarioComApontamentos,
  FuncionarioRepository,
} from '../funcionario-repository'
import { prisma } from '@/prisma'
import dayjs from 'dayjs'

export class PrismaFuncionarioRepository implements FuncionarioRepository {
  
  async desativarFuncionario(funcionarioId: string): Promise<void> {
    await prisma.funcionario.update({
      where: {
        id: funcionarioId
      },
      data: {
        ativo: false
      }
    })
  }

  async updateFuncionario(funcionarioId: string, cargo: string, tipoContratacao: string): Promise<void> {
    await prisma.funcionario.update({
      where: {
        id: funcionarioId
      },
      data: {
        cargo,
        tipo_contratacao: tipoContratacao
      }
    })
  }
  
  async fetchAllValorBonusByFuncionario(
    fazendaId: string,
    startDate: string,
    endDate: string,
  ) {
    const startOfDay = dayjs(startDate).startOf('date').toDate()
    const endOfDay = dayjs(endDate).endOf('date').toDate()

    const funcionarios = await prisma.funcionario.findMany({
      where: {
        fazenda_id: fazendaId,
      },
      include: {
        Apontamento: {
          where: {
            data_inicio: {
              gte: startOfDay,
              lte: endOfDay,
            },
          },
          select: {
            valor_bonus: true,
          },
        },
      },
    })

    const listaBonus = funcionarios.map((funcionario) => {
      const valorExtra = funcionario.Apontamento.reduce(
        (acc, apontamento) => (acc += apontamento.valor_bonus),
        0,
      )
      return { name: funcionario.nome, valor_extra: valorExtra }
    })

    const listaBonusFiltrada = listaBonus.filter(
      (lista) => lista.valor_extra > 0,
    )

    return listaBonusFiltrada
  }

  async fetchAllFuncionariosWithQrcodes(
    initialDate: string,
    endDate: string,
    fazendaId: string,
    q?: string,
  ) {
    const endDateOfTheDay = new Date(endDate)
    endDateOfTheDay.setUTCHours(23, 59, 59, 999)

    const relatorio = await prisma.funcionario.findMany({
      where: {
        fazenda_id: fazendaId,
        nome: {
          contains: q,
        },
        cargo: 'EMBALADOR',
      },
      select: {
        nome: true,
        _count: {
          select: {
            Qrcodes: {
              where: {
                validated_at: {
                  gte: new Date(initialDate),
                  lte: new Date(endDateOfTheDay),
                },
              },
            },
          },
        },
      },
      orderBy: {
        Qrcodes: {
          _count: 'desc',
        },
      },
    })

    const relatorioQrcodes = relatorio
      .map((funcionario) => ({
        nome: funcionario.nome,
        caixasEmbaladas: funcionario._count.Qrcodes,
      }))
      .sort((a, b) => b.caixasEmbaladas - a.caixasEmbaladas)

    return relatorioQrcodes
  }

  async fetchAllFuncionarios(
    fazendaId: string,
  ): Promise<FuncionarioComApontamentos[]> {
    const funcionarios = await prisma.funcionario.findMany({
      where: {
        fazenda_id: fazendaId,
        ativo: true
      },
      include: {
        Apontamento: {
          where: {
            status: 'concluida',
          },
        },
      },
      orderBy: {
        nome: 'asc',
      },
    })

    return funcionarios
  }

  async findFuncionarioById(
    funcionarioId: string,
    fazendaId: string,
  ): Promise<Funcionario | null> {
    const funcionario = await prisma.funcionario.findUnique({
      where: {
        id: funcionarioId,
        fazenda_id: fazendaId,
      },
    })

    return funcionario
  }

  async createFuncionario(
    data: Prisma.FuncionarioUncheckedCreateInput,
  ): Promise<Funcionario> {
    const funcionario = await prisma.funcionario.create({
      data,
    })

    return funcionario
  }
}
