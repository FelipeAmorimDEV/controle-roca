import { Prisma } from '@prisma/client'
import { prisma } from '@/prisma'
import { FolhaPagamentoRepository } from '../folha-pagamento-repository'

export class PrismaFolhaPagamento implements FolhaPagamentoRepository {
  async createOrUpdate(data: Prisma.FolhaPagamentoUncheckedCreateInput) {
    const folhaPagamento = await prisma.folhaPagamento.upsert({
      where: {
        funcionario_id_mesReferencia: {
          funcionario_id: data.funcionario_id,
          mesReferencia: data.mesReferencia,
        } as Prisma.FolhaPagamentoFuncionario_idMesReferenciaCompoundUniqueInput,
      },
      update: {
        totalDiasTrabalhados: data.totalDiasTrabalhados,
        totalHorasTrabalhadas: data.totalHorasTrabalhadas,
        custo_total: data.custo_total,
      },
      create: {
        mesReferencia: data.mesReferencia,
        funcionario_id: data.funcionario_id,
        totalDiasTrabalhados: data.totalDiasTrabalhados,
        totalHorasTrabalhadas: data.totalHorasTrabalhadas,
        custo_total: data.custo_total,
        fazenda_id: data.fazenda_id,
      },
    })

    return folhaPagamento
  }
}
