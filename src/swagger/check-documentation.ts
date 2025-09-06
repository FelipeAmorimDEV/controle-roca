// Script para verificar se todos os endpoints estão documentados
import { app } from '../app'

interface EndpointInfo {
  method: string
  url: string
  hasDocumentation: boolean
  tags?: string[]
  summary?: string
  description?: string
}

export function checkDocumentation() {
  console.log('🔍 Verificando documentação dos endpoints...\n')
  
  const routes = app.printRoutes()
  const endpoints: EndpointInfo[] = []
  
  // Extrair informações dos endpoints
  const routeLines = routes.split('\n')
  for (const line of routeLines) {
    if (line.includes('│') && line.includes('│')) {
      const parts = line.split('│').map(p => p.trim()).filter(p => p)
      if (parts.length >= 3) {
        const method = parts[0]
        const url = parts[1]
        
        if (method && url && method !== 'Method' && url !== 'URL') {
          endpoints.push({
            method,
            url,
            hasDocumentation: false // Será verificado abaixo
          })
        }
      }
    }
  }
  
  // Verificar se endpoints têm documentação
  const documentedEndpoints: string[] = []
  const undocumentedEndpoints: string[] = []
  
  for (const endpoint of endpoints) {
    try {
      // Tentar obter informações do schema
      const route = app.findRoute({ method: endpoint.method, url: endpoint.url })
      if (route && route.schema) {
        endpoint.hasDocumentation = true
        endpoint.tags = route.schema.tags
        endpoint.summary = route.schema.summary
        endpoint.description = route.schema.description
        documentedEndpoints.push(`${endpoint.method} ${endpoint.url}`)
      } else {
        undocumentedEndpoints.push(`${endpoint.method} ${endpoint.url}`)
      }
    } catch (error) {
      // Endpoint não encontrado ou erro
      undocumentedEndpoints.push(`${endpoint.method} ${endpoint.url}`)
    }
  }
  
  // Relatório
  console.log(`📊 Total de endpoints: ${endpoints.length}`)
  console.log(`✅ Documentados: ${documentedEndpoints.length}`)
  console.log(`❌ Não documentados: ${undocumentedEndpoints.length}`)
  console.log(`📈 Cobertura: ${((documentedEndpoints.length / endpoints.length) * 100).toFixed(1)}%\n`)
  
  if (documentedEndpoints.length > 0) {
    console.log('✅ Endpoints documentados:')
    documentedEndpoints.forEach(ep => console.log(`  - ${ep}`))
    console.log('')
  }
  
  if (undocumentedEndpoints.length > 0) {
    console.log('❌ Endpoints não documentados:')
    undocumentedEndpoints.forEach(ep => console.log(`  - ${ep}`))
    console.log('')
  }
  
  // Agrupar por tags
  const tagsCount: { [key: string]: number } = {}
  endpoints.forEach(ep => {
    if (ep.tags) {
      ep.tags.forEach(tag => {
        tagsCount[tag] = (tagsCount[tag] || 0) + 1
      })
    }
  })
  
  if (Object.keys(tagsCount).length > 0) {
    console.log('📋 Endpoints por categoria:')
    Object.entries(tagsCount)
      .sort(([,a], [,b]) => b - a)
      .forEach(([tag, count]) => {
        console.log(`  - ${tag}: ${count} endpoints`)
      })
    console.log('')
  }
  
  // Recomendações
  if (undocumentedEndpoints.length > 0) {
    console.log('💡 Recomendações:')
    console.log('  1. Documente os endpoints não documentados')
    console.log('  2. Use o template em src/swagger/IMPLEMENTATION_GUIDE.md')
    console.log('  3. Teste a documentação em http://localhost:3333/docs')
    console.log('  4. Verifique se os schemas estão corretos')
  }
  
  return {
    total: endpoints.length,
    documented: documentedEndpoints.length,
    undocumented: undocumentedEndpoints.length,
    coverage: (documentedEndpoints.length / endpoints.length) * 100,
    endpoints: endpoints,
    documentedList: documentedEndpoints,
    undocumentedList: undocumentedEndpoints
  }
}

// Executar se este arquivo for executado diretamente
if (require.main === module) {
  checkDocumentation()
}
