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
import { deleteProduct } from './controllers/estoque/delete-product'
import { deletePallet } from './controllers/pallet/delete-pallet'
import { getDashboardData } from './controllers/dashboard/get-dashboard-data'
import { createFazenda } from './controllers/fazenda/create-fazenda'
import { createNotaFiscal } from './controllers/nota-fiscal/create-nota-fiscal'
import { fetchNotasFiscais } from './controllers/nota-fiscal/fetch-all-nota-fiscal'
import { fetchNotasFiscaisVencendo } from './controllers/nota-fiscal/fetch-all-nota-fiscal-vencendo'
import { markNotaFiscalPaga } from './controllers/nota-fiscal/mark-nota-fiscal-paga'
import { deleteNotaFiscal } from './controllers/nota-fiscal/delete-nota-fiscal'
import { deleteAplicacao } from './controllers/aplicacoes/delete-aplicacao'
import { editProduto } from './controllers/estoque/edit-product'
import { getCentroCusto } from './controllers/setor/get-centro-custo'

export async function estoqueRoutes(app: FastifyInstance) {
  app.post('/products', { onRequest: [verifyJWT] }, createProduct)
  app.get('/products', { onRequest: [verifyJWT] }, fetchProducts)
  app.get('/products/:id', { onRequest: [verifyJWT] }, getProducts)
  app.delete('/products/:productId', { onRequest: [verifyJWT] }, deleteProduct)
  app.put('/products/:id', { onRequest: [verifyJWT] }, editProduto)
  app.post('/products/:id/entrada', { onRequest: [verifyJWT] }, insertProduct)
  app.post('/products/:id/saida', { onRequest: [verifyJWT] }, withdrawProduct)

  // Setor
  app.post('/setor', { onRequest: [verifyJWT] }, createSetor)
  app.get('/setor', { onRequest: [verifyJWT] }, fetchSetores)
  app.get(
    '/setor/apontamentos',
    { onRequest: [verifyJWT] },
    fetchApontamentosSetor,
  )
  app.get('/setor/centro-custo', { onRequest: [verifyJWT] }, getCentroCusto)

  app.get('/entradas', { onRequest: [verifyJWT] }, fetchEntradasAll)
  app.delete('/entradas/:entradaId', { onRequest: [verifyJWT] }, deleteEntrada)
  app.get('/saidas', { onRequest: [verifyJWT] }, fetchSaidasAll)
  app.delete('/saidas/:saidaId', { onRequest: [verifyJWT] }, deleteSaida)

  app.post('/aplicacoes', { onRequest: [verifyJWT] }, createAplicacao)
  app.get('/aplicacoes', { onRequest: [verifyJWT] }, fetchAplicacoes)
  app.delete('/aplicacoes/:id', { onRequest: [verifyJWT] }, deleteAplicacao)

  app.post('/tratoristas', { onRequest: [verifyJWT] }, createTratorista)
  app.get('/tratoristas', { onRequest: [verifyJWT] }, fetchTratoristas)

  app.post('/fornecedores', { onRequest: [verifyJWT] }, createFornecedor)
  app.get('/fornecedores', { onRequest: [verifyJWT] }, fetchFornecedor)

  app.post('/tipos', { onRequest: [verifyJWT] }, createTipo)
  app.get('/tipos', { onRequest: [verifyJWT] }, fetchTipos)

  app.post('/colheita', { onRequest: [verifyJWT] }, createColheita)
  app.get('/colheita', { onRequest: [verifyJWT] }, fetchColheitas)
  app.delete(
    '/colheita/:colheitaId',
    { onRequest: [verifyJWT] },
    deleteColheita,
  )

  app.post('/users/register', createUser)
  app.post('/users/authenticate', authenticateUser)
  app.post('/fazenda/register', createFazenda)

  // Qrcode

  app.post(
    '/funcionarios/register',
    { onRequest: [verifyJWT] },
    createFuncionario,
  )
  app.get('/funcionarios', { onRequest: [verifyJWT] }, fetchAllFuncionarios)
  app.get(
    '/funcionarios/qrcodes',
    { onRequest: [verifyJWT] },
    fetchAllFuncionariosWithQrcode,
  )
  app.post('/qrcode/generate', { onRequest: [verifyJWT] }, generateQrcodes)
  app.post('/qrcode/validate', validateQrcode)
  app.post(
    '/pallet/generate',
    { onRequest: [verifyJWT] },
    generateQrcodesPallet,
  )
  app.post('/pallet/validate', validateQrcodePallet)
  app.get('/pallet', { onRequest: [verifyJWT] }, fetchAllPallets)
  app.delete('/pallet/:palletId', { onRequest: [verifyJWT] }, deletePallet)
  app.get('/qrcode', { onRequest: [verifyJWT] }, fetchAllQrcode)
  app.post('/variedades/register', { onRequest: [verifyJWT] }, createVariedade)
  app.get('/variedades', { onRequest: [verifyJWT] }, fetchAllVariedade)

  app.post('/caixas/register', { onRequest: [verifyJWT] }, createCaixa)
  app.get('/caixas', { onRequest: [verifyJWT] }, fetchCaixas)

  app.post('/atividade/register', { onRequest: [verifyJWT] }, createAtividade)
  app.get('/atividade', { onRequest: [verifyJWT] }, fetchAtividade)
  app.post(
    '/apontamento/register',
    { onRequest: [verifyJWT] },
    createApontamento,
  )
  app.put(
    '/apontamentos/:apontamentoId',
    { onRequest: [verifyJWT] },
    concluirApontamento,
  )
  app.delete(
    '/apotamento/:apontamentoId',
    { onRequest: [verifyJWT] },
    deleteApontamento,
  )

  app.get('/dashboard', { onRequest: [verifyJWT] }, getDashboardData)

  app.post('/notas-fiscais', { onRequest: [verifyJWT] }, createNotaFiscal)
  app.get('/notas-fiscais', { onRequest: [verifyJWT] }, fetchNotasFiscais)
  app.get(
    '/notas-fiscais/vencendo',
    { onRequest: [verifyJWT] },
    fetchNotasFiscaisVencendo,
  )
  app.patch(
    '/notas-fiscais/:id',
    { onRequest: [verifyJWT] },
    markNotaFiscalPaga,
  )
  app.delete('/notas-fiscais/:id', { onRequest: [verifyJWT] }, deleteNotaFiscal)
}

// { onRequest: [verifyJWT] }
