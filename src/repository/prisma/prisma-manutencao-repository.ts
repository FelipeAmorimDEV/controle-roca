import { prisma } from '@/prisma'
import { ManutencaoRepository, CreateManutencao, FetchManutencoes, RelatorioCustomos } from '../manutencao-repository'

export class PrismaManutencaoRepository implements ManutencaoRepository {
  async create(data: CreateManutencao) {
    return await prisma.$transaction(async (tx) => {
      const trator = await tx.trator.findFirst({
        where: {
          id: data.tratarId,
          fazenda_id: data.fazenda_id
        },
        include: { alertasManutencao: true }
      })

      if (!trator) {
        throw new Error('Trator não encontrado')
      }

      // Criar manutenção
      const manutencao = await tx.manutencao.create({
        data: {
          tratorId: data.tratarId,
          tipo: data.tipo,
          descricao: data.descricao,
          custo: data.custo,
          mecanico: data.mecanico,
          status: data.status || 'CONCLUIDA',
          observacoes: data.observacoes,
          fazenda_id: data.fazenda_id,
          horasRealizacao: trator.horasAtuais
        }
      })

      // Atualizar status do trator
      if (data.status === 'EM_ANDAMENTO') {
        await tx.trator.update({
          where: { id: data.tratarId },
          data: { status: 'MANUTENCAO' }
        })
      } else if (data.status === 'CONCLUIDA') {
        await tx.trator.update({
          where: { id: data.tratarId },
          data: { status: 'ATIVO' }
        })

        // Resetar alerta correspondente
        const alerta = trator.alertasManutencao.find(a => a.tipo === data.tipo)
        if (alerta) {
          await tx.alertaManutencao.update({
            where: { id: alerta.id },
            data: {
              proximaManutencaoHoras: trator.horasAtuais + alerta.intervaloHoras
            }
          })
        }
      }

      return manutencao
    })
  }

  async fetchByTrator(
    tratarId: string,
    fazenda_id: string,
    dataInicial?: string,
    dataFinal?: string
  ): Promise<FetchManutencoes> {
    const whereClause: any = {
      tratorId: tratarId,
      fazenda_id
    }

    if (dataInicial && dataFinal) {
      whereClause.dataManutencao = {
        gte: new Date(dataInicial),
        lte: new Date(dataFinal)
      }
    }

    const manutencoes = await prisma.manutencao.findMany({
      where: whereClause,
      orderBy: { dataManutencao: 'desc' }
    })

    return {
      manutencoes,
      totalManutencoes: manutencoes.length
    }
  }

  async getRelatorioCustomos(
    tratarId: string,
    fazenda_id: string,
    dataInicial?: string,
    dataFinal?: string
  ): Promise<RelatorioCustomos> {
    const whereClause: any = {
      tratorId: tratarId,
      fazenda_id,
      status: 'CONCLUIDA'
    }

    if (dataInicial && dataFinal) {
      whereClause.dataManutencao = {
        gte: new Date(dataInicial),
        lte: new Date(dataFinal)
      }
    }

    const [manutencoes, custoTotal] = await Promise.all([
      prisma.manutencao.findMany({
        where: whereClause,
        orderBy: { dataManutencao: 'desc' }
      }),
      prisma.manutencao.aggregate({
        where: whereClause,
        _sum: { custo: true },
        _count: true
      })
    ])

    const custosPorTipo: Record<string, number> = {}
    manutencoes.forEach(manutencao => {
      if (!custosPorTipo[manutencao.tipo]) {
        custosPorTipo[manutencao.tipo] = 0
      }
      custosPorTipo[manutencao.tipo] += manutencao.custo
    })

    return {
      custoTotal: custoTotal._sum.custo || 0,
      totalManutencoes: custoTotal._count || 0,
      custosPorTipo,
      manutencoes
    }
  }
}