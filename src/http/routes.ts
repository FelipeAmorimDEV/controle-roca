import { FastifyInstance } from 'fastify'
import { createProduct } from './controllers/estoque/create-product'
import { fetchProducts } from './controllers/estoque/fetch-products'
import { getProducts } from './controllers/estoque/get-product'
import { insertProduct } from './controllers/estoque/insert-product'
import { withdrawProduct } from './controllers/estoque/withdraw-product'
import { createSetor } from './controllers/setor/create-setor'
import { fetchSetores } from './controllers/setor/fetch-setores'

import { fetchEntradasAll } from './controllers/estoque/fetch-entradas-all'
import { fetchSaidasAll } from './controllers/estoque/fetch-saidas-all'
import { createAplicacao } from './controllers/aplicacoes/create-aplicacao'
import { createTratorista } from './controllers/tratorista/create-tratorista'
import { fetchTratoristas } from './controllers/tratorista/fetch-tratoristas'
import { fetchFornecedor } from './controllers/fornecedor/fetch-fornecedor'
import { createFornecedor } from './controllers/fornecedor/create-fornecedor'
import { createTipo } from './controllers/tipos/create-tipo'
import { fetchTipos } from './controllers/tipos/fetch-tipos'
import { createUser } from './controllers/users/create-user'
import { authenticateUser } from './controllers/users/authenticate-user'
import { verifyJWT } from './middleware/jwt-verify'
import { createColheita } from './controllers/colheita/create-colheita'
import { fetchColheitas } from './controllers/colheita/fetch-colheitas'
import { fetchAplicacoes } from './controllers/aplicacoes/fetch-aplicacoes'
import { createFuncionario } from './controllers/funcionarios/create-funcionario'
import { fetchAllFuncionarios } from './controllers/funcionarios/fetch-all-funcionarios'
import { fetchAllFuncionariosWithQrcode } from './controllers/funcionarios/fetch-all-funcionarios-with-qrcodes'
import { generateQrcodes } from './controllers/qrcodes/generate-qrcodes'
import { validateQrcode } from './controllers/qrcodes/validate-qrcode'
import { generateQrcodesPallet } from './controllers/pallet/generate-qrcodes-pallet'
import { validateQrcodePallet } from './controllers/pallet/validate-qrcode-pallet'
import { fetchAllPallets } from './controllers/pallet/fetch-all-pallets'
import { fetchAllQrcode } from './controllers/qrcodes/fetch-all-qrcode'
import { createVariedade } from './controllers/variedades/create-variedade'
import { fetchAllVariedade } from './controllers/variedades/fetch-all-variedade'
import { createCaixa } from './controllers/caixas/create-caixa'
import { fetchCaixas } from './controllers/caixas/fetch-caixas'
import { deleteColheita } from './controllers/colheita/delete-colheita'
import { deleteEntrada } from './controllers/estoque/delete-entrada'
import { deleteSaida } from './controllers/estoque/delete-saida'
import { createAtividade } from './controllers/atividades/create-atividade'
import { createApontamento } from './controllers/apontamento/create-apontamento'
import { fetchApontamentosSetor } from './controllers/setor/fetch-apontamentos-setor'
import { fetchAtividade } from './controllers/atividades/fetch-atividade'
import { concluirApontamento } from './controllers/apontamento/concluir-apontamento'
import { deleteApontamento } from './controllers/apontamento/delete-apontamento'

export async function estoqueRoutes(app: FastifyInstance) {
  app.post('/products', createProduct)
  app.get('/products', fetchProducts)
  app.get('/products/:id', getProducts)
  app.post('/products/:id/entrada', { onRequest: [verifyJWT] }, insertProduct)
  app.post('/products/:id/saida', { onRequest: [verifyJWT] }, withdrawProduct)

  // Setor
  app.post('/setor', createSetor)
  app.get('/setor', fetchSetores)
  app.get('/setor/apontamentos', fetchApontamentosSetor)

  app.get('/entradas', fetchEntradasAll)
  app.delete('/entradas/:entradaId', deleteEntrada)
  app.get('/saidas', fetchSaidasAll)
  app.delete('/saidas/:saidaId', deleteSaida)

  app.post('/aplicacoes', { onRequest: [verifyJWT] }, createAplicacao)
  app.get('/aplicacoes', fetchAplicacoes)

  app.post('/tratoristas', createTratorista)
  app.get('/tratoristas', fetchTratoristas)

  app.post('/fornecedores', createFornecedor)
  app.get('/fornecedores', fetchFornecedor)

  app.post('/tipos', createTipo)
  app.get('/tipos', fetchTipos)

  app.post('/colheita', createColheita)
  app.get('/colheita', fetchColheitas)
  app.delete('/colheita/:colheitaId', deleteColheita)

  app.post('/users/register', createUser)
  app.post('/users/authenticate', authenticateUser)

  // Qrcode

  app.post('/funcionarios/register', createFuncionario)
  app.get('/funcionarios', fetchAllFuncionarios)
  app.get('/funcionarios/qrcodes', fetchAllFuncionariosWithQrcode)
  app.post('/qrcode/generate', generateQrcodes)
  app.post('/qrcode/validate', validateQrcode)
  app.post('/pallet/generate', generateQrcodesPallet)
  app.post('/pallet/validate', validateQrcodePallet)
  app.get('/pallet', fetchAllPallets)
  app.get('/qrcode', fetchAllQrcode)
  app.post('/variedades/register', createVariedade)
  app.get('/variedades', fetchAllVariedade)

  app.post('/caixas/register', createCaixa)
  app.get('/caixas', fetchCaixas)

  app.post('/atividade/register', createAtividade)
  app.get('/atividade', fetchAtividade)
  app.post('/apontamento/register', createApontamento)
  app.put('/apotamento/:apontamentoId', concluirApontamento)
  app.delete('/apotamento/:apontamentoId', deleteApontamento)
}

// { onRequest: [verifyJWT] }
