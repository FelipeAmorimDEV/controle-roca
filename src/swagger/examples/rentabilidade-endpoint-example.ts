// Exemplo de documentação do endpoint de rentabilidade para o Swagger
export const rentabilidadeEndpointExample = {
  schema: {
    tags: ['Relatórios e Dashboard'],
    summary: 'Relatório de Análise de Rentabilidade por Setor',
    description: `
      Gera um relatório completo de análise de rentabilidade por setor, incluindo:
      
      **📊 Métricas de Receita:**
      - Receita total por setor
      - Peso total colhido
      - Preço médio de venda
      - Quantidade de caixas
      
      **💰 Análise de Custos:**
      - Custos de material (insumos)
      - Custos de mão de obra (apontamentos)
      - Custos de aplicações
      - Custos de fertirrigação
      - Custo total por setor
      
      **📈 Indicadores de Rentabilidade:**
      - Margem bruta (valor e percentual)
      - Receita por hectare
      - Custo por hectare
      - Lucro por hectare
      
      **🌱 Produtividade:**
      - Produtividade por hectare (kg/hectare)
      - Eficiência de custo (receita/custo)
      
      **📊 Comparativo:**
      - Variação de receita vs período anterior
      - Variação de custo vs período anterior
      - Variação de lucro vs período anterior
      
      **🎯 Recomendações:**
      - Análise automática de performance
      - Identificação de setores problemáticos
      - Sugestões de melhorias
    `,
    security: [{ bearerAuth: [] }],
    querystring: {
      $ref: '#/components/schemas/RentabilidadeRequest'
    },
    response: {
      200: {
        description: 'Relatório de rentabilidade gerado com sucesso',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/RentabilidadeResponse'
            },
            example: {
              success: true,
              message: 'Relatório de rentabilidade gerado com sucesso',
              data: {
                setores: [
                  {
                    setorId: '123e4567-e89b-12d3-a456-426614174000',
                    setorName: 'Setor A',
                    tamanhoArea: 2.5,
                    variedade: 'Vitoria',
                    receitaTotal: 50000.00,
                    pesoTotalColhido: 10000,
                    precoMedioVenda: 15.50,
                    quantidadeCaixas: 2500,
                    custoTotalMaterial: 15000.00,
                    custoTotalMaoDeObra: 8000.00,
                    custoTotalAplicacoes: 5000.00,
                    custoTotalFertirrigacao: 2000.00,
                    custoTotal: 30000.00,
                    margemBruta: 20000.00,
                    margemBrutaPercentual: 40.0,
                    receitaPorHectare: 20000.00,
                    custoPorHectare: 12000.00,
                    lucroPorHectare: 8000.00,
                    produtividadePorHectare: 4000.0,
                    eficienciaCusto: 1.67,
                    variacaoReceita: 15.5,
                    variacaoCusto: 8.2,
                    variacaoLucro: 25.3
                  }
                ],
                totais: {
                  receitaTotal: 200000.00,
                  custoTotal: 120000.00,
                  lucroTotal: 80000.00,
                  areaTotal: 10.0,
                  margemMedia: 40.0
                },
                resumo: {
                  setorMaisRentavel: 'Setor A',
                  setorMenosRentavel: 'Setor C',
                  melhorProdutividade: 'Setor B',
                  maiorMargem: 'Setor A',
                  recomendacoes: [
                    '✅ Setor A apresenta excelente rentabilidade (R$ 8.000,00/hectare)',
                    '⚠️ Setor C está com prejuízo (R$ -500,00/hectare) - requer atenção',
                    '📊 2 setor(es) com custos acima da média - revisar eficiência operacional'
                  ]
                }
              },
              periodo: {
                inicial: '2024-01-01',
                final: '2024-12-31',
                dias: 365
              }
            }
          }
        }
      },
      400: {
        description: 'Dados inválidos ou data inicial posterior à data final',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error'
            },
            example: {
              message: 'Data inicial deve ser anterior à data final'
            }
          }
        }
      },
      401: {
        description: 'Token JWT inválido ou expirado',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error'
            }
          }
        }
      },
      500: {
        description: 'Erro interno do servidor',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error'
            },
            example: {
              message: 'Erro interno do servidor ao gerar relatório',
              error: 'Detalhes do erro'
            }
          }
        }
      }
    }
  }
}
