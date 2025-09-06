import { prisma } from '@/prisma'
import { RentabilidadeRepository, RelatorioRentabilidadeSetor } from '../rentabilidade-repository'

export class PrismaRentabilidadeRepository implements RentabilidadeRepository {
  async getRelatorioRentabilidadeSetor(
    fazendaId: string,
    initialDate: string,
    endDate: string,
    setorId?: string
  ): Promise<RelatorioRentabilidadeSetor[]> {
    const endDateOfTheDay = new Date(endDate)
    endDateOfTheDay.setUTCHours(23, 59, 59, 999)

    // Buscar setores com dados completos
    const setores = await prisma.setor.findMany({
      where: {
        fazenda_id: fazendaId,
        id: setorId,
        tamanhoArea: { gt: 0 }
      },
      include: {
        // Colheitas com preços de venda
        Colheita: {
          where: {
            createdAt: {
              gte: new Date(initialDate),
              lte: new Date(endDateOfTheDay),
            },
          },
          include: {
            preco_venda: true,
            tipoCaixa: true
          }
        },
        // Saídas de estoque (custos de material)
        Saida: {
          where: {
            createdAt: {
              gte: new Date(initialDate),
              lte: new Date(endDateOfTheDay),
            },
          },
          include: {
            Product: true
          }
        },
        // Apontamentos (custos de mão de obra)
        Apontamento: {
          where: {
            data_inicio: {
              gte: new Date(initialDate),
              lte: new Date(endDateOfTheDay),
            },
          }
        },
        // Aplicações
        Aplicacao: {
          where: {
            createdAt: {
              gte: new Date(initialDate),
              lte: new Date(endDateOfTheDay),
            },
          }
        },
        // Fertirrigações
        Fertirrigacao: {
          where: {
            created_at: {
              gte: new Date(initialDate),
              lte: new Date(endDateOfTheDay),
            },
          }
        },
        // Variedade
        variedade: true
      }
    })

    const relatorios: RelatorioRentabilidadeSetor[] = []

    for (const setor of setores) {
      // Calcular receitas
      const receitaTotal = setor.Colheita.reduce((acc, colheita) => {
        if (colheita.preco_venda) {
          return acc + (colheita.preco_venda.preco * colheita.qntCaixa)
        }
        return acc
      }, 0)

      const pesoTotalColhido = setor.Colheita.reduce((acc, colheita) => {
        return acc + colheita.pesoTotal
      }, 0)

      const quantidadeCaixas = setor.Colheita.reduce((acc, colheita) => {
        return acc + colheita.qntCaixa
      }, 0)

      const precoMedioVenda = quantidadeCaixas > 0 ? receitaTotal / quantidadeCaixas : 0

      // Calcular custos
      const custoTotalMaterial = setor.Saida.reduce((acc, saida) => {
        return acc + (saida.priceSaida || 0)
      }, 0)

      const custoTotalMaoDeObra = setor.Apontamento.reduce((acc, apontamento) => {
        return acc + (apontamento.custo_tarefa || 0)
      }, 0)

      const custoTotalAplicacoes = setor.Aplicacao.reduce((acc, aplicacao) => {
        return acc + (aplicacao.custoTotal || 0)
      }, 0)

      const custoTotalFertirrigacao = setor.Fertirrigacao.reduce((acc, fertirrigacao) => {
        return acc + (fertirrigacao.custoTotal || 0)
      }, 0)

      const custoTotal = custoTotalMaterial + custoTotalMaoDeObra + custoTotalAplicacoes + custoTotalFertirrigacao

      // Calcular indicadores de rentabilidade
      const margemBruta = receitaTotal - custoTotal
      const margemBrutaPercentual = receitaTotal > 0 ? (margemBruta / receitaTotal) * 100 : 0

      const receitaPorHectare = setor.tamanhoArea > 0 ? receitaTotal / setor.tamanhoArea : 0
      const custoPorHectare = setor.tamanhoArea > 0 ? custoTotal / setor.tamanhoArea : 0
      const lucroPorHectare = receitaPorHectare - custoPorHectare

      // Calcular produtividade
      const produtividadePorHectare = setor.tamanhoArea > 0 ? pesoTotalColhido / setor.tamanhoArea : 0
      const eficienciaCusto = custoTotal > 0 ? receitaTotal / custoTotal : 0

      // Buscar dados do período anterior para comparação
      const dataInicialAnterior = new Date(initialDate)
      const dataFinalAnterior = new Date(endDate)
      const duracaoPeriodo = dataFinalAnterior.getTime() - dataInicialAnterior.getTime()
      
      dataInicialAnterior.setTime(dataInicialAnterior.getTime() - duracaoPeriodo)
      dataFinalAnterior.setTime(dataFinalAnterior.getTime() - duracaoPeriodo)

      const dadosAnteriores = await this.getDadosPeriodoAnterior(
        setor.id,
        dataInicialAnterior.toISOString().split('T')[0],
        dataFinalAnterior.toISOString().split('T')[0]
      )

      const variacaoReceita = dadosAnteriores.receitaTotal > 0 
        ? ((receitaTotal - dadosAnteriores.receitaTotal) / dadosAnteriores.receitaTotal) * 100 
        : 0

      const variacaoCusto = dadosAnteriores.custoTotal > 0 
        ? ((custoTotal - dadosAnteriores.custoTotal) / dadosAnteriores.custoTotal) * 100 
        : 0

      const variacaoLucro = dadosAnteriores.lucroTotal > 0 
        ? ((margemBruta - dadosAnteriores.lucroTotal) / dadosAnteriores.lucroTotal) * 100 
        : 0

      relatorios.push({
        setorId: setor.id,
        setorName: setor.setorName,
        tamanhoArea: setor.tamanhoArea,
        variedade: setor.variedade?.nome || 'N/A',
        
        // Receitas
        receitaTotal,
        pesoTotalColhido,
        precoMedioVenda,
        quantidadeCaixas,
        
        // Custos
        custoTotalMaterial,
        custoTotalMaoDeObra,
        custoTotalAplicacoes,
        custoTotalFertirrigacao,
        custoTotal,
        
        // Indicadores de Rentabilidade
        margemBruta,
        margemBrutaPercentual,
        receitaPorHectare,
        custoPorHectare,
        lucroPorHectare,
        
        // Produtividade
        produtividadePorHectare,
        eficienciaCusto,
        
        // Comparativo
        variacaoReceita,
        variacaoCusto,
        variacaoLucro
      })
    }

    return relatorios
  }

  async getComparativoRentabilidade(
    fazendaId: string,
    initialDate: string,
    endDate: string
  ): Promise<{
    setores: RelatorioRentabilidadeSetor[]
    totais: {
      receitaTotal: number
      custoTotal: number
      lucroTotal: number
      areaTotal: number
      margemMedia: number
    }
  }> {
    const setores = await this.getRelatorioRentabilidadeSetor(fazendaId, initialDate, endDate)

    const totais = setores.reduce((acc, setor) => {
      acc.receitaTotal += setor.receitaTotal
      acc.custoTotal += setor.custoTotal
      acc.lucroTotal += setor.margemBruta
      acc.areaTotal += setor.tamanhoArea
      return acc
    }, {
      receitaTotal: 0,
      custoTotal: 0,
      lucroTotal: 0,
      areaTotal: 0,
      margemMedia: 0
    })

    totais.margemMedia = totais.receitaTotal > 0 ? (totais.lucroTotal / totais.receitaTotal) * 100 : 0

    return {
      setores,
      totais
    }
  }

  private async getDadosPeriodoAnterior(
    setorId: string,
    initialDate: string,
    endDate: string
  ): Promise<{
    receitaTotal: number
    custoTotal: number
    lucroTotal: number
  }> {
    const endDateOfTheDay = new Date(endDate)
    endDateOfTheDay.setUTCHours(23, 59, 59, 999)

    // Buscar dados do período anterior
    const [colheitas, saidas, apontamentos, aplicacoes, fertirrigacoes] = await Promise.all([
      prisma.colheita.findMany({
        where: {
          setorId: setorId,
          createdAt: {
            gte: new Date(initialDate),
            lte: new Date(endDateOfTheDay),
          },
        },
        include: {
          preco_venda: true
        }
      }),
      prisma.saida.findMany({
        where: {
          setorId: setorId,
          createdAt: {
            gte: new Date(initialDate),
            lte: new Date(endDateOfTheDay),
          },
        }
      }),
      prisma.apontamento.findMany({
        where: {
          setor_id: setorId,
          data_inicio: {
            gte: new Date(initialDate),
            lte: new Date(endDateOfTheDay),
          },
        }
      }),
      prisma.aplicacao.findMany({
        where: {
          setorId: setorId,
          createdAt: {
            gte: new Date(initialDate),
            lte: new Date(endDateOfTheDay),
          },
        }
      }),
      prisma.fertirrigacao.findMany({
        where: {
          setor_id: setorId,
          created_at: {
            gte: new Date(initialDate),
            lte: new Date(endDateOfTheDay),
          },
        }
      })
    ])

    const receitaTotal = colheitas.reduce((acc, colheita) => {
      if (colheita.preco_venda) {
        return acc + (colheita.preco_venda.preco * colheita.qntCaixa)
      }
      return acc
    }, 0)

    const custoTotal = 
      saidas.reduce((acc, saida) => acc + (saida.priceSaida || 0), 0) +
      apontamentos.reduce((acc, apontamento) => acc + (apontamento.custo_tarefa || 0), 0) +
      aplicacoes.reduce((acc, aplicacao) => acc + (aplicacao.custoTotal || 0), 0) +
      fertirrigacoes.reduce((acc, fertirrigacao) => acc + (fertirrigacao.custoTotal || 0), 0)

    const lucroTotal = receitaTotal - custoTotal

    return {
      receitaTotal,
      custoTotal,
      lucroTotal
    }
  }
}
