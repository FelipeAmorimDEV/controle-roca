export interface RelatorioRentabilidadeSetor {
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
  produtividadePorHectare: number // kg/hectare
  eficienciaCusto: number // receita/custo

  // Comparativo
  variacaoReceita: number
  variacaoCusto: number
  variacaoLucro: number
}

export interface RentabilidadeRepository {
  getRelatorioRentabilidadeSetor(
    fazendaId: string,
    initialDate: string,
    endDate: string,
    setorId?: string,
  ): Promise<RelatorioRentabilidadeSetor[]>

  getComparativoRentabilidade(
    fazendaId: string,
    initialDate: string,
    endDate: string,
  ): Promise<{
    setores: RelatorioRentabilidadeSetor[]
    totais: {
      receitaTotal: number
      custoTotal: number
      lucroTotal: number
      areaTotal: number
      margemMedia: number
    }
  }>
}
