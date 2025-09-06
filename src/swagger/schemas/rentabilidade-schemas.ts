export const rentabilidadeSchemas = {
  // Request para relatório de rentabilidade
  RentabilidadeRequest: {
    type: 'object',
    properties: {
      initialDate: {
        type: 'string',
        format: 'date',
        description: 'Data inicial do período (YYYY-MM-DD)',
        example: '2024-01-01'
      },
      endDate: {
        type: 'string',
        format: 'date',
        description: 'Data final do período (YYYY-MM-DD)',
        example: '2024-12-31'
      },
      setorId: {
        type: 'string',
        format: 'uuid',
        description: 'ID do setor específico (opcional)',
        example: '123e4567-e89b-12d3-a456-426614174000'
      }
    },
    required: ['initialDate', 'endDate']
  },

  // Schema para dados de um setor
  SetorRentabilidade: {
    type: 'object',
    properties: {
      setorId: { type: 'string', format: 'uuid' },
      setorName: { type: 'string', example: 'Setor A' },
      tamanhoArea: { type: 'number', example: 2.5 },
      variedade: { type: 'string', example: 'Vitoria' },
      
      // Receitas
      receitaTotal: { type: 'number', example: 50000.00 },
      pesoTotalColhido: { type: 'number', example: 10000 },
      precoMedioVenda: { type: 'number', example: 15.50 },
      quantidadeCaixas: { type: 'number', example: 2500 },
      
      // Custos
      custoTotalMaterial: { type: 'number', example: 15000.00 },
      custoTotalMaoDeObra: { type: 'number', example: 8000.00 },
      custoTotalAplicacoes: { type: 'number', example: 5000.00 },
      custoTotalFertirrigacao: { type: 'number', example: 2000.00 },
      custoTotal: { type: 'number', example: 30000.00 },
      
      // Indicadores de Rentabilidade
      margemBruta: { type: 'number', example: 20000.00 },
      margemBrutaPercentual: { type: 'number', example: 40.0 },
      receitaPorHectare: { type: 'number', example: 20000.00 },
      custoPorHectare: { type: 'number', example: 12000.00 },
      lucroPorHectare: { type: 'number', example: 8000.00 },
      
      // Produtividade
      produtividadePorHectare: { type: 'number', example: 4000.0 },
      eficienciaCusto: { type: 'number', example: 1.67 },
      
      // Comparativo
      variacaoReceita: { type: 'number', example: 15.5 },
      variacaoCusto: { type: 'number', example: 8.2 },
      variacaoLucro: { type: 'number', example: 25.3 }
    }
  },

  // Schema para totais gerais
  TotaisRentabilidade: {
    type: 'object',
    properties: {
      receitaTotal: { type: 'number', example: 200000.00 },
      custoTotal: { type: 'number', example: 120000.00 },
      lucroTotal: { type: 'number', example: 80000.00 },
      areaTotal: { type: 'number', example: 10.0 },
      margemMedia: { type: 'number', example: 40.0 }
    }
  },

  // Schema para resumo e recomendações
  ResumoRentabilidade: {
    type: 'object',
    properties: {
      setorMaisRentavel: { type: 'string', example: 'Setor A' },
      setorMenosRentavel: { type: 'string', example: 'Setor C' },
      melhorProdutividade: { type: 'string', example: 'Setor B' },
      maiorMargem: { type: 'string', example: 'Setor A' },
      recomendacoes: {
        type: 'array',
        items: { type: 'string' },
        example: [
          '✅ Setor A apresenta excelente rentabilidade (R$ 8.000,00/hectare)',
          '⚠️ Setor C está com prejuízo (R$ -500,00/hectare) - requer atenção',
          '📊 2 setor(es) com custos acima da média - revisar eficiência operacional'
        ]
      }
    }
  },

  // Schema para dados do período
  PeriodoRentabilidade: {
    type: 'object',
    properties: {
      inicial: { type: 'string', format: 'date', example: '2024-01-01' },
      final: { type: 'string', format: 'date', example: '2024-12-31' },
      dias: { type: 'number', example: 365 }
    }
  },

  // Schema completo da resposta
  RentabilidadeResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      message: { type: 'string', example: 'Relatório de rentabilidade gerado com sucesso' },
      data: {
        type: 'object',
        properties: {
          setores: {
            type: 'array',
            items: { $ref: '#/components/schemas/SetorRentabilidade' }
          },
          totais: { $ref: '#/components/schemas/TotaisRentabilidade' },
          resumo: { $ref: '#/components/schemas/ResumoRentabilidade' }
        }
      },
      periodo: { $ref: '#/components/schemas/PeriodoRentabilidade' }
    }
  }
}
