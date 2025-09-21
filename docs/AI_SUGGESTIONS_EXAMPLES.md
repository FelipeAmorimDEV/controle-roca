# Exemplos de Uso do Sistema de IA para Sugestões

## Cenários de Uso Comuns

### 1. Consultar Sugestões para um Setor Específico

**Situação**: Você quer ver sugestões de aplicação para o Setor A que foi podado há 20 dias.

```bash
# Buscar sugestões para o setor específico
curl -X GET "http://localhost:3333/ai/sugestoes?setorId=setor-123" \
  -H "Authorization: Bearer SEU_TOKEN_JWT" \
  -H "Content-Type: application/json"
```

**Resposta esperada**:
```json
{
  "success": true,
  "data": {
    "sugestoes": [
      {
        "setorId": "setor-123",
        "setorNome": "Setor A",
        "faseAtual": "Brotação 2",
        "diasAposPoda": 20,
        "sugestaoFertirrigacao": {
          "id": "fert-1234567890",
          "setorId": "setor-123",
          "faseFenologica": "Brotação 2",
          "produtos": [
            {
              "produtoId": "prod-npk-123",
              "nome": "Fertilizante NPK 20-20-20",
              "quantidade": 2.5,
              "unidade": "kg",
              "justificativa": "Baseado em 12 aplicações históricas na fase Brotação 2"
            },
            {
              "produtoId": "prod-micro-456",
              "nome": "Micronutrientes",
              "quantidade": 0.5,
              "unidade": "L",
              "justificativa": "Baseado em 8 aplicações históricas na fase Brotação 2"
            }
          ],
          "dataSugerida": "2024-01-15T10:00:00Z",
          "confianca": 85,
          "observacoes": "Sugestão baseada em padrões históricos. Confiabilidade: 85%"
        },
        "sugestaoPulverizacao": null,
        "confiabilidadeGeral": 85
      }
    ],
    "estatisticas": {
      "totalSetores": 1,
      "setoresComSugestoes": 1,
      "setoresComFertirrigacao": 1,
      "setoresComPulverizacao": 0,
      "confiabilidadeMedia": 85
    }
  }
}
```

### 2. Consultar Sugestões para Toda a Fazenda

**Situação**: Você quer ver um panorama geral de todas as sugestões da fazenda.

```bash
# Buscar sugestões para toda a fazenda
curl -X GET "http://localhost:3333/ai/sugestoes?fazendaId=fazenda-456" \
  -H "Authorization: Bearer SEU_TOKEN_JWT" \
  -H "Content-Type: application/json"
```

**Resposta esperada**:
```json
{
  "success": true,
  "data": {
    "sugestoes": [
      {
        "setorId": "setor-123",
        "setorNome": "Setor A",
        "faseAtual": "Brotação 2",
        "diasAposPoda": 20,
        "sugestaoFertirrigacao": { /* ... */ },
        "sugestaoPulverizacao": null,
        "confiabilidadeGeral": 85
      },
      {
        "setorId": "setor-124",
        "setorNome": "Setor B",
        "faseAtual": "Florada",
        "diasAposPoda": 40,
        "sugestaoFertirrigacao": null,
        "sugestaoPulverizacao": {
          "id": "pulv-1234567890",
          "setorId": "setor-124",
          "faseFenologica": "Florada",
          "produtos": [
            {
              "produtoId": "prod-fung-789",
              "nome": "Fungicida Preventivo",
              "dosagem": 0.3,
              "unidade": "L",
              "justificativa": "Baseado em 15 aplicações históricas na fase Florada"
            }
          ],
          "volumeCalda": 200,
          "dataSugerida": "2024-01-16T08:00:00Z",
          "confianca": 92,
          "observacoes": "Sugestão baseada em padrões históricos. Confiabilidade: 92%"
        },
        "confiabilidadeGeral": 92
      }
    ],
    "estatisticas": {
      "totalSetores": 10,
      "setoresComSugestoes": 8,
      "setoresComFertirrigacao": 6,
      "setoresComPulverizacao": 4,
      "confiabilidadeMedia": 78.5
    }
  }
}
```

### 3. Aplicar uma Sugestão de Fertirrigação

**Situação**: Você quer aplicar a sugestão de fertirrigação gerada pelo sistema.

```bash
# Aplicar sugestão de fertirrigação
curl -X POST "http://localhost:3333/ai/sugestoes/setor-123/aplicar" \
  -H "Authorization: Bearer SEU_TOKEN_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "tipo": "fertirrigacao",
    "sugestaoId": "fert-1234567890",
    "observacoes": "Aplicação baseada em sugestão de IA - Brotação 2"
  }'
```

**Resposta esperada**:
```json
{
  "success": true,
  "message": "fertirrigacao aplicada com sucesso",
  "data": {
    "id": "fert-789",
    "setorId": "setor-123",
    "faseFenologica": "Brotação 2",
    "tipo": "fertirrigacao",
    "produtos": [
      {
        "produtoId": "prod-npk-123",
        "nome": "Fertilizante NPK 20-20-20",
        "quantidade": 2.5,
        "unidade": "kg",
        "justificativa": "Baseado em 12 aplicações históricas na fase Brotação 2"
      },
      {
        "produtoId": "prod-micro-456",
        "nome": "Micronutrientes",
        "quantidade": 0.5,
        "unidade": "L",
        "justificativa": "Baseado em 8 aplicações históricas na fase Brotação 2"
      }
    ],
    "confianca": 85,
    "observacoes": "Aplicação baseada em sugestão de IA - Brotação 2"
  }
}
```

### 4. Aplicar uma Sugestão de Pulverização

**Situação**: Você quer aplicar a sugestão de pulverização para controle de pragas.

```bash
# Aplicar sugestão de pulverização
curl -X POST "http://localhost:3333/ai/sugestoes/setor-124/aplicar" \
  -H "Authorization: Bearer SEU_TOKEN_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "tipo": "pulverizacao",
    "sugestaoId": "pulv-1234567890",
    "observacoes": "Aplicação preventiva na fase de florada"
  }'
```

### 5. Analisar Padrões de Aplicação

**Situação**: Você quer entender os padrões históricos de aplicação da fazenda.

```bash
# Buscar padrões de aplicação
curl -X GET "http://localhost:3333/ai/padroes-aplicacao?fazendaId=fazenda-456" \
  -H "Authorization: Bearer SEU_TOKEN_JWT" \
  -H "Content-Type: application/json"
```

**Resposta esperada**:
```json
{
  "success": true,
  "data": {
    "padroes": [
      {
        "faseFenologica": "Brotação 2",
        "tipo": "fertirrigacao",
        "totalAplicacoes": 15,
        "frequenciaMedia": 7.5,
        "confiabilidadeMedia": 85,
        "produtos": [
          {
            "produtoId": "prod-npk-123",
            "nome": "Fertilizante NPK 20-20-20",
            "quantidadeMedia": 2.3,
            "variacao": 12.5,
            "unidade": "kg",
            "frequencia": 15
          }
        ]
      },
      {
        "faseFenologica": "Florada",
        "tipo": "pulverizacao",
        "totalAplicacoes": 12,
        "frequenciaMedia": 5.0,
        "confiabilidadeMedia": 92,
        "produtos": [
          {
            "produtoId": "prod-fung-789",
            "nome": "Fungicida Preventivo",
            "quantidadeMedia": 0.3,
            "variacao": 8.2,
            "unidade": "L",
            "frequencia": 12
          }
        ]
      }
    ],
    "estatisticas": {
      "totalSetores": 10,
      "setoresComDataPoda": 8,
      "setoresComHistorico": 6,
      "totalAplicacoes": 45,
      "fasesIdentificadas": ["Poda", "Brotação 1", "Brotação 2", "Florada", "Chumbinho"]
    }
  }
}
```

## Casos de Uso Avançados

### 1. Análise com Período Personalizado

**Situação**: Você quer analisar apenas os últimos 6 meses de dados.

```bash
# Buscar sugestões com período personalizado
curl -X GET "http://localhost:3333/ai/sugestoes?fazendaId=fazenda-456&dataInicio=2024-07-01&dataFim=2024-12-31" \
  -H "Authorization: Bearer SEU_TOKEN_JWT" \
  -H "Content-Type: application/json"
```

### 2. Monitoramento de Confiabilidade

**Situação**: Você quer identificar setores com baixa confiabilidade nas sugestões.

```bash
# Buscar padrões para identificar problemas
curl -X GET "http://localhost:3333/ai/padroes-aplicacao?fazendaId=fazenda-456" \
  -H "Authorization: Bearer SEU_TOKEN_JWT" \
  -H "Content-Type: application/json"
```

**Interpretação dos resultados**:
- Confiabilidade > 80%: Dados muito consistentes
- Confiabilidade 60-80%: Dados razoavelmente consistentes
- Confiabilidade < 60%: Dados inconsistentes ou insuficientes

### 3. Integração com Sistema de Estoque

**Situação**: Verificar se há produtos suficientes antes de aplicar sugestões.

```bash
# 1. Buscar sugestões
curl -X GET "http://localhost:3333/ai/sugestoes?setorId=setor-123" \
  -H "Authorization: Bearer SEU_TOKEN_JWT"

# 2. Verificar estoque dos produtos sugeridos
curl -X GET "http://localhost:3333/products" \
  -H "Authorization: Bearer SEU_TOKEN_JWT"

# 3. Aplicar apenas se houver estoque suficiente
curl -X POST "http://localhost:3333/ai/sugestoes/setor-123/aplicar" \
  -H "Authorization: Bearer SEU_TOKEN_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "tipo": "fertirrigacao",
    "sugestaoId": "fert-1234567890",
    "observacoes": "Aplicação com estoque verificado"
  }'
```

## Scripts de Automação

### 1. Script para Aplicar Todas as Sugestões de Alta Confiabilidade

```bash
#!/bin/bash

# Configurações
FAZENDA_ID="fazenda-456"
TOKEN="SEU_TOKEN_JWT"
BASE_URL="http://localhost:3333"

# Buscar sugestões
echo "Buscando sugestões para fazenda $FAZENDA_ID..."
SUGESTOES=$(curl -s -X GET "$BASE_URL/ai/sugestoes?fazendaId=$FAZENDA_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json")

# Processar sugestões com confiabilidade > 80%
echo "$SUGESTOES" | jq -r '.data.sugestoes[] | select(.confiabilidadeGeral > 80) | "\(.setorId) \(.sugestaoFertirrigacao.id // "null") \(.sugestaoPulverizacao.id // "null")"' | while read setorId fertId pulvId; do
  
  # Aplicar fertirrigação se disponível
  if [ "$fertId" != "null" ]; then
    echo "Aplicando fertirrigação $fertId no setor $setorId..."
    curl -s -X POST "$BASE_URL/ai/sugestoes/$setorId/aplicar" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d "{\"tipo\": \"fertirrigacao\", \"sugestaoId\": \"$fertId\", \"observacoes\": \"Aplicação automática - alta confiabilidade\"}"
  fi
  
  # Aplicar pulverização se disponível
  if [ "$pulvId" != "null" ]; then
    echo "Aplicando pulverização $pulvId no setor $setorId..."
    curl -s -X POST "$BASE_URL/ai/sugestoes/$setorId/aplicar" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d "{\"tipo\": \"pulverizacao\", \"sugestaoId\": \"$pulvId\", \"observacoes\": \"Aplicação automática - alta confiabilidade\"}"
  fi
done

echo "Processo concluído!"
```

### 2. Script para Relatório Semanal de Sugestões

```bash
#!/bin/bash

# Configurações
FAZENDA_ID="fazenda-456"
TOKEN="SEU_TOKEN_JWT"
BASE_URL="http://localhost:3333"
RELATORIO_FILE="relatorio_sugestoes_$(date +%Y%m%d).txt"

echo "=== Relatório de Sugestões de IA - $(date) ===" > $RELATORIO_FILE
echo "" >> $RELATORIO_FILE

# Buscar sugestões
echo "Gerando relatório de sugestões..."
SUGESTOES=$(curl -s -X GET "$BASE_URL/ai/sugestoes?fazendaId=$FAZENDA_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json")

# Estatísticas gerais
echo "ESTATÍSTICAS GERAIS:" >> $RELATORIO_FILE
echo "$SUGESTOES" | jq -r '.data.estatisticas | "Total de Setores: \(.totalSetores)\nSetores com Sugestões: \(.setoresComSugestoes)\nSetores com Fertirrigação: \(.setoresComFertirrigacao)\nSetores com Pulverização: \(.setoresComPulverizacao)\nConfiabilidade Média: \(.confiabilidadeMedia)%"' >> $RELATORIO_FILE
echo "" >> $RELATORIO_FILE

# Detalhes por setor
echo "DETALHES POR SETOR:" >> $RELATORIO_FILE
echo "$SUGESTOES" | jq -r '.data.sugestoes[] | "Setor: \(.setorNome) (\(.setorId))\nFase Atual: \(.faseAtual)\nDias após Poda: \(.diasAposPoda)\nConfiabilidade: \(.confiabilidadeGeral)%\n"' >> $RELATORIO_FILE

echo "Relatório salvo em: $RELATORIO_FILE"
```

## Troubleshooting

### Problema: Nenhuma sugestão gerada

**Possíveis causas**:
1. Setor sem data de poda registrada
2. Histórico insuficiente de aplicações
3. Confiabilidade muito baixa

**Solução**:
```bash
# Verificar dados do setor
curl -X GET "http://localhost:3333/setor" \
  -H "Authorization: Bearer $TOKEN"

# Verificar histórico de aplicações
curl -X GET "http://localhost:3333/aplicacoes" \
  -H "Authorization: Bearer $TOKEN"
```

### Problema: Sugestões com baixa confiabilidade

**Possíveis causas**:
1. Dados históricos inconsistentes
2. Poucas aplicações registradas
3. Variação muito alta nas quantidades

**Solução**:
1. Revisar e corrigir dados históricos
2. Aguardar mais aplicações para melhorar a base de dados
3. Ajustar parâmetros de análise se necessário

### Problema: Erro ao aplicar sugestão

**Possíveis causas**:
1. Produto não encontrado no estoque
2. Setor não encontrado
3. Funcionário não disponível

**Solução**:
```bash
# Verificar estoque
curl -X GET "http://localhost:3333/products" \
  -H "Authorization: Bearer $TOKEN"

# Verificar funcionários ativos
curl -X GET "http://localhost:3333/funcionarios" \
  -H "Authorization: Bearer $TOKEN"
```
