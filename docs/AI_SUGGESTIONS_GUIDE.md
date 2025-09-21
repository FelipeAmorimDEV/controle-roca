# Guia do Sistema de IA para Sugestões de Aplicação

## Visão Geral

O sistema de IA para sugestões de aplicação analisa o histórico de fertirrigações e pulverizações para gerar recomendações inteligentes baseadas na fase fenológica atual dos setores. O sistema utiliza algoritmos de análise de padrões para identificar frequências de aplicação, quantidades médias de produtos e confiabilidade das sugestões.

## Funcionalidades Principais

### 1. Análise de Padrões Históricos
- Calcula fases fenológicas retroativas baseadas na data de poda
- Identifica padrões de aplicação por fase fenológica
- Calcula frequência média de aplicações
- Determina quantidades médias de produtos por fase

### 2. Geração de Sugestões
- **Fertirrigação**: Sugere produtos e quantidades baseadas no histórico
- **Pulverização**: Recomenda dosagens e volume de calda
- **Confiabilidade**: Calcula nível de confiança das sugestões (0-100%)

### 3. Aplicação Automática
- Permite aplicar sugestões diretamente no sistema
- Cria registros de aplicação automaticamente
- Atualiza estoque de produtos

## Endpoints da API

### 1. Obter Sugestões de IA

**GET** `/ai/sugestoes`

**Parâmetros de Query:**
- `setorId` (opcional): ID do setor específico
- `fazendaId` (opcional): ID da fazenda para todos os setores
- `dataInicio` (opcional): Data de início para análise (padrão: 1 ano atrás)
- `dataFim` (opcional): Data de fim para análise (padrão: hoje)

**Exemplo de Resposta:**
```json
{
  "success": true,
  "data": {
    "sugestoes": [
      {
        "setorId": "setor-123",
        "setorNome": "Setor A",
        "faseAtual": "Brotação 2",
        "diasAposPoda": 18,
        "sugestaoFertirrigacao": {
          "id": "fert-1234567890",
          "setorId": "setor-123",
          "faseFenologica": "Brotação 2",
          "produtos": [
            {
              "produtoId": "prod-123",
              "nome": "Fertilizante NPK",
              "quantidade": 2.5,
              "unidade": "kg",
              "justificativa": "Baseado em 15 aplicações históricas na fase Brotação 2"
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
      "totalSetores": 10,
      "setoresComSugestoes": 8,
      "setoresComFertirrigacao": 6,
      "setoresComPulverizacao": 4,
      "confiabilidadeMedia": 78.5
    }
  }
}
```

### 2. Obter Padrões de Aplicação

**GET** `/ai/padroes-aplicacao`

**Parâmetros de Query:**
- `fazendaId` (obrigatório): ID da fazenda
- `dataInicio` (opcional): Data de início para análise
- `dataFim` (opcional): Data de fim para análise

**Exemplo de Resposta:**
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
            "produtoId": "prod-123",
            "nome": "Fertilizante NPK",
            "quantidadeMedia": 2.3,
            "variacao": 12.5,
            "unidade": "kg",
            "frequencia": 15
          }
        ]
      }
    ],
    "estatisticas": {
      "totalSetores": 10,
      "setoresComDataPoda": 8,
      "setoresComHistorico": 6,
      "totalAplicacoes": 45,
      "fasesIdentificadas": ["Poda", "Brotação 1", "Brotação 2", "Florada"]
    }
  }
}
```

### 3. Aplicar Sugestão de IA

**POST** `/ai/sugestoes/:setorId/aplicar`

**Body:**
```json
{
  "tipo": "fertirrigacao",
  "sugestaoId": "fert-1234567890",
  "observacoes": "Aplicação baseada em sugestão de IA"
}
```

**Exemplo de Resposta:**
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
        "produtoId": "prod-123",
        "nome": "Fertilizante NPK",
        "quantidade": 2.5,
        "unidade": "kg",
        "justificativa": "Baseado em 15 aplicações históricas na fase Brotação 2"
      }
    ],
    "confianca": 85,
    "observacoes": "Aplicação baseada em sugestão de IA"
  }
}
```

## Como o Sistema Funciona

### 1. Cálculo de Fases Fenológicas Retroativas

O sistema calcula fases fenológicas retroativas para aplicações que ocorreram antes da data de poda atual:

```typescript
// Exemplo: Setor podado hoje, aplicação de 200 dias atrás
const dataPoda = new Date(); // Hoje
const diasAtras = 200;
const cicloCultivo = 120; // dias

// Calcula quantos ciclos completos
const ciclosCompletos = Math.floor(200 / 120); // 1 ciclo

// Gera data de poda retroativa
const dataPodaRetroativa = new Date(dataPoda);
dataPodaRetroativa.setDate(dataPodaRetroativa.getDate() - (1 * 120)); // 120 dias atrás

// Calcula fase para a aplicação de 200 dias atrás
const diasRetroativos = 200 - 120; // 80 dias
const fase = calcularFaseParaData(dataPodaRetroativa, dataAplicacao);
```

### 2. Análise de Padrões

O sistema agrupa aplicações por fase fenológica e tipo, calculando:

- **Frequência média**: Intervalo médio entre aplicações
- **Quantidade média**: Quantidade média de cada produto
- **Variação**: Desvio padrão das quantidades
- **Confiabilidade**: Baseada no número de amostras e consistência

### 3. Geração de Sugestões

As sugestões são geradas considerando:

- Fase fenológica atual do setor
- Padrões históricos para essa fase
- Frequência de aplicações anteriores
- Confiabilidade dos dados históricos

## Configurações

### Parâmetros Ajustáveis

```typescript
// src/services/ai-suggestion-service.ts
private readonly CICLO_CULTIVO_DAYS = 120; // Média de tempo de cultivo
private readonly MIN_HISTORICO_APLICACOES = 3; // Mínimo de aplicações para análise
```

### Fases Fenológicas

As fases são definidas em `src/constants/fases.ts`:

- **Poda**: 0-8 dias
- **Brotação 1**: 9-14 dias
- **Brotação 2**: 15-21 dias
- **Brotação 3**: 22-28 dias
- **Pre-Flor**: 29-35 dias
- **Florada**: 36-42 dias
- **Chumbinho**: 43-49 dias
- **Raleio 1**: 50-56 dias
- **Raleio 2**: 57-63 dias
- **Pós Raleio 1**: 64-70 dias
- **Pós Raleio 2**: 71-77 dias
- **Pós Raleio 3**: 78-84 dias
- **Pré Amolecimento**: 85-91 dias
- **Amolecimento 1**: 92-98 dias
- **Amolecimento 2**: 99-105 dias
- **Maturação**: 106-111 dias
- **Colheita**: 112+ dias

## Monitoramento e Ajustes

### Métricas de Confiabilidade

- **90-100%**: Dados muito consistentes, alta confiança
- **70-89%**: Dados consistentes, boa confiança
- **50-69%**: Dados moderadamente consistentes, confiança média
- **30-49%**: Dados pouco consistentes, baixa confiança
- **0-29%**: Dados insuficientes ou muito inconsistentes

### Recomendações de Uso

1. **Para setores novos**: Use sugestões com confiabilidade > 70%
2. **Para setores com histórico**: Use sugestões com confiabilidade > 50%
3. **Sempre revise**: As sugestões são baseadas em padrões históricos
4. **Ajuste conforme necessário**: Considere condições climáticas e específicas do setor

## Troubleshooting

### Problemas Comuns

1. **Nenhuma sugestão gerada**:
   - Verifique se o setor tem data de poda registrada
   - Confirme se há histórico de aplicações
   - Verifique se a confiabilidade é suficiente (>30%)

2. **Sugestões com baixa confiabilidade**:
   - Aumente o período de análise histórica
   - Verifique a consistência dos dados de aplicação
   - Considere ajustar os parâmetros de análise

3. **Fases fenológicas incorretas**:
   - Verifique se a data de poda está correta
   - Confirme se o ciclo de cultivo está adequado
   - Ajuste as fases em `src/constants/fases.ts` se necessário

## Exemplos de Uso

### Exemplo 1: Buscar sugestões para um setor específico

```bash
curl -X GET "http://localhost:3333/ai/sugestoes?setorId=setor-123" \
  -H "Authorization: Bearer SEU_TOKEN"
```

### Exemplo 2: Buscar sugestões para toda a fazenda

```bash
curl -X GET "http://localhost:3333/ai/sugestoes?fazendaId=fazenda-456" \
  -H "Authorization: Bearer SEU_TOKEN"
```

### Exemplo 3: Aplicar uma sugestão de fertirrigação

```bash
curl -X POST "http://localhost:3333/ai/sugestoes/setor-123/aplicar" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "tipo": "fertirrigacao",
    "sugestaoId": "fert-1234567890",
    "observacoes": "Aplicação baseada em sugestão de IA"
  }'
```

## Próximos Passos

1. **Machine Learning**: Implementar algoritmos de ML mais avançados
2. **Integração Climática**: Incorporar dados meteorológicos
3. **Alertas Inteligentes**: Notificações automáticas para aplicações
4. **Dashboard**: Interface visual para monitoramento das sugestões
5. **Relatórios**: Análises detalhadas de eficácia das sugestões
