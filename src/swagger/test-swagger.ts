// Script para testar se o Swagger está funcionando corretamente
import { app } from '../app'

async function testSwagger() {
  try {
    console.log('🧪 Testando configuração do Swagger...')
    
    // Verificar se o app foi registrado corretamente
    if (!app.hasRoute({ method: 'GET', url: '/docs' })) {
      console.error('❌ Rota /docs não encontrada')
      return false
    }
    
    console.log('✅ Rota /docs encontrada')
    
    // Verificar se o app tem as rotas de documentação
    if (!app.hasRoute({ method: 'GET', url: '/docs/json' })) {
      console.error('❌ Rota /docs/json não encontrada')
      return false
    }
    
    console.log('✅ Rota /docs/json encontrada')
    
    // Verificar se os schemas foram registrados
    const schemas = app.getSchemas()
    const expectedSchemas = [
      'User',
      'Product',
      'Funcionario',
      'Setor',
      'Colheita',
      'Trator',
      'Apontamento',
      'Aplicacao',
      'NotaFiscal',
      'Dashboard'
    ]
    
    for (const schema of expectedSchemas) {
      if (!schemas[schema]) {
        console.warn(`⚠️  Schema ${schema} não encontrado`)
      } else {
        console.log(`✅ Schema ${schema} encontrado`)
      }
    }
    
    console.log('🎉 Teste do Swagger concluído com sucesso!')
    console.log('📚 Acesse: http://localhost:3333/docs')
    
    return true
  } catch (error) {
    console.error('❌ Erro ao testar Swagger:', error)
    return false
  }
}

// Executar teste se este arquivo for executado diretamente
if (require.main === module) {
  testSwagger()
}

export { testSwagger }
