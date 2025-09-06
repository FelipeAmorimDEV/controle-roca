# 📊 Relatório de Análise de Rentabilidade por Setor

## 🎯 **Visão Geral**

O relatório de análise de rentabilidade por setor é uma ferramenta poderosa que permite analisar a performance financeira de cada setor da fazenda, fornecendo insights detalhados sobre receitas, custos e indicadores de rentabilidade.

## 🚀 **Como Usar**

### **Endpoint**
```
GET /relatorios/rentabilidade
```

### **Parâmetros de Query**
- `initialDate` (obrigatório): Data inicial do período (formato: YYYY-MM-DD)
- `endDate` (obrigatório): Data final do período (formato: YYYY-MM-DD)
- `setorId` (opcional): ID do setor específico para análise

### **Exemplo de Requisição**
```bash
GET /relatorios/rentabilidade?initialDate=2024-01-01&endDate=2024-12-31
```

### **Exemplo de Requisição para Setor Específico**
```bash
GET /relatorios/rentabilidade?initialDate=2024-01-01&endDate=2024-12-31&setorId=123e4567-e89b-12d3-a456-426614174000
```

## 📊 **Dados Analisados**

### **💰 Receitas**
- **Receita Total**: Soma de todas as vendas do setor no período
- **Peso Total Colhido**: Quantidade total em kg colhida
- **Preço Médio de Venda**: Preço médio por caixa vendida
- **Quantidade de Caixas**: Total de caixas colhidas

### **💸 Custos**
- **Custo de Material**: Insumos utilizados no setor
- **Custo de Mão de Obra**: Apontamentos de funcionários
- **Custo de Aplicações**: Produtos aplicados no setor
- **Custo de Fertirrigação**: Fertirrigações realizadas
- **Custo Total**: Soma de todos os custos

### **📈 Indicadores de Rentabilidade**
- **Margem Bruta**: Receita - Custo Total
- **Margem Bruta %**: (Margem Bruta / Receita) × 100
- **Receita por Hectare**: Receita Total / Área do Setor
- **Custo por Hectare**: Custo Total / Área do Setor
- **Lucro por Hectare**: Receita por Hectare - Custo por Hectare

### **🌱 Produtividade**
- **Produtividade por Hectare**: Peso Colhido / Área do Setor
- **Eficiência de Custo**: Receita Total / Custo Total

### **📊 Comparativo**
- **Variação de Receita**: Comparação com período anterior
- **Variação de Custo**: Comparação com período anterior
- **Variação de Lucro**: Comparação com período anterior

## 🎯 **Recomendações Automáticas**

O sistema gera recomendações baseadas na análise dos dados:

### **✅ Recomendações Positivas**
- Setores com excelente rentabilidade
- Setores com alta produtividade
- Setores com boa eficiência de custo

### **⚠️ Alertas de Atenção**
- Setores com prejuízo
- Setores com custos acima da média
- Setores com baixa produtividade
- Setores com margem baixa

### **📊 Análises Comparativas**
- Identificação de setores problemáticos
- Comparação de performance entre setores
- Sugestões de otimização

## 📋 **Exemplo de Resposta**

```json
{
  "success": true,
  "message": "Relatório de rentabilidade gerado com sucesso",
  "data": {
    "setores": [
      {
        "setorId": "123e4567-e89b-12d3-a456-426614174000",
        "setorName": "Setor A",
        "tamanhoArea": 2.5,
        "variedade": "Vitoria",
        "receitaTotal": 50000.00,
        "pesoTotalColhido": 10000,
        "precoMedioVenda": 15.50,
        "quantidadeCaixas": 2500,
        "custoTotalMaterial": 15000.00,
        "custoTotalMaoDeObra": 8000.00,
        "custoTotalAplicacoes": 5000.00,
        "custoTotalFertirrigacao": 2000.00,
        "custoTotal": 30000.00,
        "margemBruta": 20000.00,
        "margemBrutaPercentual": 40.0,
        "receitaPorHectare": 20000.00,
        "custoPorHectare": 12000.00,
        "lucroPorHectare": 8000.00,
        "produtividadePorHectare": 4000.0,
        "eficienciaCusto": 1.67,
        "variacaoReceita": 15.5,
        "variacaoCusto": 8.2,
        "variacaoLucro": 25.3
      }
    ],
    "totais": {
      "receitaTotal": 200000.00,
      "custoTotal": 120000.00,
      "lucroTotal": 80000.00,
      "areaTotal": 10.0,
      "margemMedia": 40.0
    },
    "resumo": {
      "setorMaisRentavel": "Setor A",
      "setorMenosRentavel": "Setor C",
      "melhorProdutividade": "Setor B",
      "maiorMargem": "Setor A",
      "recomendacoes": [
        "✅ Setor A apresenta excelente rentabilidade (R$ 8.000,00/hectare)",
        "⚠️ Setor C está com prejuízo (R$ -500,00/hectare) - requer atenção",
        "📊 2 setor(es) com custos acima da média - revisar eficiência operacional"
      ]
    }
  },
  "periodo": {
    "inicial": "2024-01-01",
    "final": "2024-12-31",
    "dias": 365
  }
}
```

## 🔍 **Interpretação dos Dados**

### **Margem Bruta Percentual**
- **> 50%**: Excelente rentabilidade
- **30-50%**: Boa rentabilidade
- **20-30%**: Rentabilidade moderada
- **< 20%**: Rentabilidade baixa (atenção necessária)

### **Eficiência de Custo**
- **> 1.5**: Muito eficiente
- **1.2-1.5**: Eficiente
- **1.0-1.2**: Moderadamente eficiente
- **< 1.0**: Ineficiente (prejuízo)

### **Produtividade por Hectare**
- Varia conforme a cultura e variedade
- Compare com benchmarks do setor
- Analise tendências ao longo do tempo

## 🎯 **Como Usar os Dados**

### **1. Identificar Setores Problemáticos**
- Foque nos setores com margem baixa ou prejuízo
- Analise os custos elevados
- Verifique a produtividade

### **2. Replicar Boas Práticas**
- Identifique o que funciona nos setores rentáveis
- Aplique as mesmas práticas nos setores problemáticos
- Monitore os resultados

### **3. Otimizar Custos**
- Analise os custos por categoria
- Identifique oportunidades de redução
- Negocie melhores preços com fornecedores

### **4. Melhorar Produtividade**
- Investiga setores com baixa produtividade
- Verifique condições de solo e manejo
- Considere mudanças de variedade

## 📈 **Análise de Tendências**

### **Variações Positivas**
- Aumento de receita
- Redução de custos
- Melhoria da produtividade

### **Variações Negativas**
- Queda de receita
- Aumento de custos
- Redução da produtividade

## 🚨 **Alertas Importantes**

- **Setores com prejuízo**: Requerem ação imediata
- **Custos acima da média**: Investigar causas
- **Baixa produtividade**: Verificar manejo
- **Margem baixa**: Revisar preços ou custos

## 💡 **Dicas de Uso**

1. **Analise regularmente**: Execute o relatório mensalmente
2. **Compare períodos**: Use dados históricos para identificar tendências
3. **Foque nos indicadores**: Margem bruta e lucro por hectare são os mais importantes
4. **Aja rapidamente**: Implemente melhorias baseadas nos dados
5. **Monitore resultados**: Acompanhe o impacto das mudanças

## 🔧 **Troubleshooting**

### **Erro: "Data inicial deve ser anterior à data final"**
- Verifique se a data inicial é anterior à data final
- Use o formato correto: YYYY-MM-DD

### **Erro: "Nenhum dado disponível"**
- Verifique se existem dados no período selecionado
- Confirme se o setor tem colheitas registradas

### **Dados inconsistentes**
- Verifique se as colheitas têm preços de venda associados
- Confirme se os apontamentos estão corretos
- Verifique se as saídas de estoque estão registradas

## 📞 **Suporte**

Para dúvidas ou problemas com o relatório:
- Consulte a documentação da API
- Verifique os logs do sistema
- Entre em contato com o suporte técnico
