import { RentabilidadeRepository } from '@/repository/rentabilidade-repository'

interface GetRelatorioRentabilidadeUseCaseParams {
  fazenda_id: string
  initialDate: string
  endDate: string
  setorId?: string
}

interface GetRelatorioRentabilidadeUseCaseResponse {
  relatorio: {
    setores: Array<{
      setorId: string
      setorName: string
      tamanhoArea: number
      variedade: string
      
      // Receitas
      receitaTotal: number
      pesoTotalColhido: number
      precoMedioVenda: number
      quantidadeCaixas: number
      
      // Custos
      custoTotalMaterial: number
      custoTotalMaoDeObra: number
      custoTotalAplicacoes: number
      custoTotalFertirrigacao: number
      custoTotal: number
      
      // Indicadores de Rentabilidade
      margemBruta: number
      margemBrutaPercentual: number
      receitaPorHectare: number
      custoPorHectare: number
      lucroPorHectare: number
      
      // Produtividade
      produtividadePorHectare: number
      eficienciaCusto: number
      
      // Comparativo
      variacaoReceita: number
      variacaoCusto: number
      variacaoLucro: number
    }>
    totais: {
      receitaTotal: number
      custoTotal: number
      lucroTotal: number
      areaTotal: number
      margemMedia: number
    }
    resumo: {
      setorMaisRentavel: string
      setorMenosRentavel: string
      melhorProdutividade: string
      maiorMargem: string
      recomendacoes: string[]
    }
  }
}

export class GetRelatorioRentabilidadeUseCase {
  constructor(
    private rentabilidadeRepository: RentabilidadeRepository,
  ) {}

  async execute({
    fazenda_id,
    initialDate,
    endDate,
    setorId,
  }: GetRelatorioRentabilidadeUseCaseParams): Promise<GetRelatorioRentabilidadeUseCaseResponse> {
    const { setores, totais } = await this.rentabilidadeRepository.getComparativoRentabilidade(
      fazenda_id,
      initialDate,
      endDate
    )

    // Filtrar por setor específico se fornecido
    const setoresFiltrados = setorId 
      ? setores.filter(setor => setor.setorId === setorId)
      : setores

    // Gerar resumo e recomendações
    const resumo = this.gerarResumo(setoresFiltrados)

    return {
      relatorio: {
        setores: setoresFiltrados,
        totais,
        resumo
      }
    }
  }

  private gerarResumo(setores: any[]) {
    if (setores.length === 0) {
      return {
        setorMaisRentavel: 'N/A',
        setorMenosRentavel: 'N/A',
        melhorProdutividade: 'N/A',
        maiorMargem: 'N/A',
        recomendacoes: ['Nenhum dado disponível para análise']
      }
    }

    // Encontrar setores com melhor e pior performance
    const setorMaisRentavel = setores.reduce((max, setor) => 
      setor.lucroPorHectare > max.lucroPorHectare ? setor : max
    )
    
    const setorMenosRentavel = setores.reduce((min, setor) => 
      setor.lucroPorHectare < min.lucroPorHectare ? setor : min
    )

    const melhorProdutividade = setores.reduce((max, setor) => 
      setor.produtividadePorHectare > max.produtividadePorHectare ? setor : max
    )

    const maiorMargem = setores.reduce((max, setor) => 
      setor.margemBrutaPercentual > max.margemBrutaPercentual ? setor : max
    )

    // Gerar recomendações
    const recomendacoes = this.gerarRecomendacoes(setores, setorMaisRentavel, setorMenosRentavel)

    return {
      setorMaisRentavel: setorMaisRentavel.setorName,
      setorMenosRentavel: setorMenosRentavel.setorName,
      melhorProdutividade: melhorProdutividade.setorName,
      maiorMargem: maiorMargem.setorName,
      recomendacoes
    }
  }

  private gerarRecomendacoes(setores: any[], melhor: any, pior: any): string[] {
    const recomendacoes: string[] = []

    // Análise de rentabilidade
    if (melhor.lucroPorHectare > 0) {
      recomendacoes.push(`✅ Setor ${melhor.setorName} apresenta excelente rentabilidade (R$ ${melhor.lucroPorHectare.toFixed(2)}/hectare)`)
    }

    if (pior.lucroPorHectare < 0) {
      recomendacoes.push(`⚠️ Setor ${pior.setorName} está com prejuízo (R$ ${pior.lucroPorHectare.toFixed(2)}/hectare) - requer atenção`)
    }

    // Análise de custos
    const custoMedio = setores.reduce((acc, s) => acc + s.custoPorHectare, 0) / setores.length
    const setoresCustoAlto = setores.filter(s => s.custoPorHectare > custoMedio * 1.2)
    
    if (setoresCustoAlto.length > 0) {
      recomendacoes.push(`📊 ${setoresCustoAlto.length} setor(es) com custos acima da média - revisar eficiência operacional`)
    }

    // Análise de produtividade
    const produtividadeMedia = setores.reduce((acc, s) => acc + s.produtividadePorHectare, 0) / setores.length
    const setoresBaixaProdutividade = setores.filter(s => s.produtividadePorHectare < produtividadeMedia * 0.8)
    
    if (setoresBaixaProdutividade.length > 0) {
      recomendacoes.push(`🌱 ${setoresBaixaProdutividade.length} setor(es) com baixa produtividade - verificar manejo e condições`)
    }

    // Análise de margem
    const setoresMargemBaixa = setores.filter(s => s.margemBrutaPercentual < 20)
    if (setoresMargemBaixa.length > 0) {
      recomendacoes.push(`💰 ${setoresMargemBaixa.length} setor(es) com margem baixa (<20%) - revisar preços de venda ou custos`)
    }

    // Análise de eficiência
    const setoresEficienciaBaixa = setores.filter(s => s.eficienciaCusto < 1.2)
    if (setoresEficienciaBaixa.length > 0) {
      recomendacoes.push(`⚡ ${setoresEficienciaBaixa.length} setor(es) com baixa eficiência de custo - otimizar processos`)
    }

    // Recomendações gerais
    if (recomendacoes.length === 0) {
      recomendacoes.push('🎉 Todos os setores apresentam performance satisfatória!')
    }

    return recomendacoes
  }
}
