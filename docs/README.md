# 📚 Documentação Swagger/OpenAPI

Este diretório contém toda a configuração e schemas para a documentação automática da API usando Swagger/OpenAPI.

## 🚀 Como usar

### 1. Acessar a documentação
Após iniciar o servidor, acesse:
- **URL da documentação**: http://localhost:3333/docs
- **JSON da API**: http://localhost:3333/docs/json

### 2. Estrutura dos arquivos

```
src/swagger/
├── index.ts                    # Configuração principal do Swagger
├── swagger-config.ts          # Configuração base do OpenAPI
├── schemas/
│   ├── index.ts               # Schemas dos modelos de dados
│   ├── requests.ts            # Schemas de requisições
│   └── responses.ts           # Schemas de respostas
├── examples/
│   └── endpoints-examples.ts  # Exemplos de documentação de endpoints
└── README.md                  # Este arquivo
```

### 3. Como documentar um endpoint

Para documentar um endpoint, adicione o schema na definição da rota:

```typescript
// Exemplo: src/http/controllers/users/authenticate-user.ts
export async function authenticateUser(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  // ... código do controlador
}

// Adicionar schema na rota (src/http/routes.ts)
app.post('/users/authenticate', {
  schema: {
    tags: ['Autenticação'],
    summary: 'Autenticar usuário',
    description: 'Realiza login do usuário e retorna token JWT',
    body: {
      $ref: '#/components/schemas/AuthenticateRequest'
    },
    response: {
      200: {
        description: 'Login realizado com sucesso',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/AuthenticateResponse'
            }
          }
        }
      },
      401: {
        description: 'Credenciais inválidas',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error'
            }
          }
        }
      }
    }
  }
}, authenticateUser)
```

### 4. Schemas disponíveis

#### Modelos de dados
- `User` - Usuário do sistema
- `Fazenda` - Fazenda
- `Product` - Produto
- `Funcionario` - Funcionário
- `Setor` - Setor da fazenda
- `Colheita` - Colheita
- `Trator` - Trator
- `Apontamento` - Apontamento de atividade
- `Aplicacao` - Aplicação de produtos
- `NotaFiscal` - Nota fiscal
- `Dashboard` - Dados do dashboard

#### Requisições
- `CreateUserRequest` - Criar usuário
- `AuthenticateRequest` - Autenticar
- `CreateProductRequest` - Criar produto
- `CreateFuncionarioRequest` - Criar funcionário
- `CreateSetorRequest` - Criar setor
- `CreateColheitaRequest` - Criar colheita
- `CreateTratorRequest` - Criar trator
- `CreateApontamentoRequest` - Criar apontamento
- E muitos outros...

#### Respostas
- `SuccessResponse` - Resposta de sucesso genérica
- `AuthenticateResponse` - Resposta de autenticação
- `ProductsListResponse` - Lista de produtos
- `DashboardResponse` - Dados do dashboard
- E muitos outros...

### 5. Tags organizadas

A documentação está organizada em tags:

- **Autenticação** - Login, registro, usuários
- **Fazendas** - Gestão de fazendas
- **Produtos e Estoque** - Controle de produtos e movimentações
- **Funcionários** - Gestão de funcionários e apontamentos
- **Setores e Atividades** - Setores e atividades
- **Colheitas** - Registro de colheitas e preços
- **Tratores e Manutenção** - Gestão de tratores
- **Aplicações e Fertirrigação** - Aplicações de produtos
- **QR Codes e Pallets** - Sistema de QR codes
- **Notas Fiscais** - Gestão de notas fiscais
- **Relatórios e Dashboard** - Relatórios e métricas
- **Cadastros Auxiliares** - Tipos, fornecedores, etc.

### 6. Segurança

Todos os endpoints protegidos usam autenticação JWT:
```typescript
security: [{ bearerAuth: [] }]
```

### 7. Exemplos de uso

A documentação inclui exemplos de:
- Dados de entrada (request body)
- Dados de saída (response)
- Códigos de erro
- Parâmetros de query
- Parâmetros de path

### 8. Personalização

Para personalizar a documentação:

1. **Alterar informações básicas**: Edite `swagger-config.ts`
2. **Adicionar novos schemas**: Adicione em `schemas/`
3. **Modificar exemplos**: Edite `examples/endpoints-examples.ts`
4. **Alterar configuração do UI**: Modifique `index.ts`

### 9. Validação

O Swagger valida automaticamente:
- ✅ Tipos de dados
- ✅ Campos obrigatórios
- ✅ Formatos (email, uuid, date, etc.)
- ✅ Enums
- ✅ Estruturas de objetos

### 10. Testes

Use a interface do Swagger para:
- 🧪 Testar endpoints diretamente
- 📝 Ver exemplos de requisições
- 📖 Ler documentação completa
- 🔍 Explorar a API

## 🎯 Próximos passos

1. **Documentar todos os endpoints** - Adicionar schemas em todas as rotas
2. **Adicionar mais exemplos** - Incluir exemplos realistas
3. **Melhorar descrições** - Adicionar descrições mais detalhadas
4. **Adicionar testes** - Criar testes baseados na documentação
5. **Versionamento** - Implementar versionamento da API

## 📞 Suporte

Para dúvidas sobre a documentação:
- Consulte os exemplos em `examples/endpoints-examples.ts`
- Verifique a documentação oficial do Fastify Swagger
- Acesse a documentação interativa em `/docs`
