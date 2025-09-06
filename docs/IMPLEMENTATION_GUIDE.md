# 🚀 Guia de Implementação da Documentação Swagger

Este guia mostra como implementar a documentação Swagger em todos os endpoints do sistema.

## 📋 Checklist de Implementação

### ✅ Já implementado
- [x] Configuração base do Swagger
- [x] Schemas de dados principais
- [x] Schemas de requisições
- [x] Schemas de respostas
- [x] Configuração do servidor
- [x] Interface Swagger UI funcionando

### 🔄 Em andamento
- [ ] Documentar endpoints de autenticação
- [ ] Documentar endpoints de produtos
- [ ] Documentar endpoints de funcionários
- [ ] Documentar endpoints de setores
- [ ] Documentar endpoints de colheitas
- [ ] Documentar endpoints de tratores
- [ ] Documentar endpoints de apontamentos
- [ ] Documentar endpoints de aplicações
- [ ] Documentar endpoints de QR codes
- [ ] Documentar endpoints de notas fiscais
- [ ] Documentar endpoints de dashboard
- [ ] Documentar endpoints auxiliares

## 🛠️ Como implementar

### 1. Documentar um endpoint existente

**Antes:**
```typescript
// src/http/routes.ts
app.post('/products', { onRequest: [verifyJWT] }, createProduct)
```

**Depois:**
```typescript
// src/http/routes.ts
app.post('/products', {
  schema: {
    tags: ['Produtos e Estoque'],
    summary: 'Criar produto',
    description: 'Cadastra um novo produto no sistema',
    security: [{ bearerAuth: [] }],
    body: {
      $ref: '#/components/schemas/CreateProductRequest'
    },
    response: {
      201: {
        description: 'Produto criado com sucesso',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ProductResponse'
            }
          }
        }
      },
      400: {
        description: 'Dados inválidos',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error'
            }
          }
        }
      },
      401: {
        description: 'Token inválido',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error'
            }
          }
        }
      }
    }
  },
  onRequest: [verifyJWT]
}, createProduct)
```

### 2. Adicionar novos schemas

Se precisar de um novo schema, adicione em `src/swagger/schemas/`:

```typescript
// src/swagger/schemas/requests.ts
export const requestSchemas = {
  // ... schemas existentes
  
  NewRequest: {
    type: 'object',
    required: ['field1', 'field2'],
    properties: {
      field1: { type: 'string', example: 'valor exemplo' },
      field2: { type: 'number', example: 123 }
    }
  }
}
```

### 3. Documentar endpoints com parâmetros

```typescript
app.get('/products/:id', {
  schema: {
    tags: ['Produtos e Estoque'],
    summary: 'Buscar produto por ID',
    description: 'Retorna um produto específico pelo ID',
    security: [{ bearerAuth: [] }],
    params: {
      type: 'object',
      properties: {
        id: { 
          type: 'string', 
          format: 'uuid',
          description: 'ID único do produto'
        }
      },
      required: ['id']
    },
    response: {
      200: {
        description: 'Produto encontrado',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ProductResponse'
            }
          }
        }
      },
      404: {
        description: 'Produto não encontrado',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error'
            }
          }
        }
      }
    }
  },
  onRequest: [verifyJWT]
}, getProduct)
```

### 4. Documentar endpoints com query parameters

```typescript
app.get('/products', {
  schema: {
    tags: ['Produtos e Estoque'],
    summary: 'Listar produtos',
    description: 'Lista produtos com paginação e filtros',
    security: [{ bearerAuth: [] }],
    querystring: {
      type: 'object',
      properties: {
        q: { 
          type: 'string', 
          description: 'Termo de busca',
          example: 'fertilizante'
        },
        page: { 
          type: 'integer', 
          minimum: 1, 
          default: 1,
          description: 'Número da página'
        },
        perPage: { 
          type: 'integer', 
          minimum: 1, 
          maximum: 100, 
          default: 10,
          description: 'Itens por página'
        }
      }
    },
    response: {
      200: {
        description: 'Lista de produtos',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ProductsListResponse'
            }
          }
        }
      }
    }
  },
  onRequest: [verifyJWT]
}, fetchProducts)
```

## 📝 Template para novos endpoints

```typescript
app.METHOD('/endpoint', {
  schema: {
    tags: ['Categoria'],
    summary: 'Título do endpoint',
    description: 'Descrição detalhada do que o endpoint faz',
    security: [{ bearerAuth: [] }], // Se necessário
    body: {
      $ref: '#/components/schemas/RequestSchema'
    },
    params: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' }
      },
      required: ['id']
    },
    querystring: {
      type: 'object',
      properties: {
        param: { type: 'string' }
      }
    },
    response: {
      200: {
        description: 'Sucesso',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ResponseSchema'
            }
          }
        }
      },
      400: {
        description: 'Dados inválidos',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error'
            }
          }
        }
      },
      401: {
        description: 'Token inválido',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error'
            }
          }
        }
      },
      404: {
        description: 'Recurso não encontrado',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error'
            }
          }
        }
      }
    }
  },
  onRequest: [verifyJWT] // Se necessário
}, controllerFunction)
```

## 🎯 Prioridades de implementação

### Alta prioridade (Endpoints principais)
1. **Autenticação** - `/users/authenticate`, `/users/register`
2. **Produtos** - `/products/*`
3. **Funcionários** - `/funcionarios/*`
4. **Dashboard** - `/dashboard`
5. **Colheitas** - `/colheita/*`

### Média prioridade (Funcionalidades importantes)
1. **Setores** - `/setor/*`
2. **Apontamentos** - `/apontamento/*`
3. **Tratores** - `/tratores/*`
4. **Aplicações** - `/aplicacoes/*`
5. **Notas Fiscais** - `/notas-fiscais/*`

### Baixa prioridade (Funcionalidades auxiliares)
1. **QR Codes** - `/qrcode/*`, `/pallet/*`
2. **Cadastros auxiliares** - `/tipos/*`, `/fornecedores/*`, etc.
3. **Relatórios** - `/apontamentos-fiscal`, `/centro-custo`, etc.

## 🔍 Verificação

Após implementar a documentação:

1. **Teste local**: Acesse http://localhost:3333/docs
2. **Verifique schemas**: Confirme se todos os schemas estão corretos
3. **Teste endpoints**: Use a interface do Swagger para testar
4. **Validação**: Verifique se as validações estão funcionando
5. **Exemplos**: Confirme se os exemplos estão corretos

## 📚 Recursos úteis

- **Documentação oficial**: https://swagger.io/docs/
- **Fastify Swagger**: https://github.com/fastify/fastify-swagger
- **OpenAPI 3.0**: https://swagger.io/specification/
- **Exemplos**: `src/swagger/examples/endpoints-documented.ts`

## 🚨 Cuidados importantes

1. **Sempre use schemas existentes** quando possível
2. **Mantenha consistência** nos nomes e descrições
3. **Inclua exemplos** realistas
4. **Documente todos os códigos de erro** possíveis
5. **Use tags apropriadas** para organização
6. **Valide os dados** com Zod antes de documentar
7. **Teste a documentação** antes de considerar completa

## ✅ Checklist final

- [ ] Todos os endpoints documentados
- [ ] Schemas de request/response corretos
- [ ] Exemplos realistas incluídos
- [ ] Códigos de erro documentados
- [ ] Tags organizadas corretamente
- [ ] Validações funcionando
- [ ] Interface Swagger testada
- [ ] Documentação revisada
