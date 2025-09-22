import { prisma } from '../prisma';
import { HistoricoAplicacao, DadosSetor } from '../@types/ai-suggestions';

export interface AISuggestionRepository {
  buscarHistoricoAplicacoes(
    setorId: string, 
    dataInicio: Date, 
    dataFim: Date
  ): Promise<HistoricoAplicacao[]>;
  
  buscarDadosSetor(setorId: string): Promise<DadosSetor | null>;
  
  buscarHistoricoCompletoFazenda(
    fazendaId: string, 
    dataInicio: Date, 
    dataFim: Date
  ): Promise<DadosSetor[]>;
  
  buscarPadroesGlobaisPorFase(
    fazendaId: string,
    faseFenologica: string,
    dataInicio: Date,
    dataFim: Date
  ): Promise<HistoricoAplicacao[]>;
}

export class PrismaAISuggestionRepository implements AISuggestionRepository {
  constructor(private prismaClient: typeof prisma) {}

  async buscarHistoricoAplicacoes(
    setorId: string, 
    dataInicio: Date, 
    dataFim: Date
  ): Promise<HistoricoAplicacao[]> {
    console.log('Buscando histórico de aplicações para setor:', setorId);
    const historico: HistoricoAplicacao[] = [];

    // Busca aplicações de pulverização
    const aplicacoes = await this.prismaClient.aplicacao.findMany({
      where: {
        setorId,
        createdAt: {
          gte: dataInicio,
          lte: dataFim
        }
      },
      include: {
        saidas: {
          include: {
            Product: true
          }
        }
      }
    });

    console.log('Aplicações encontradas:', aplicacoes.length);
    if (aplicacoes.length > 0) {
      console.log('Primeira aplicação produtosAplicados:', typeof aplicacoes[0].produtosAplicados, aplicacoes[0].produtosAplicados);
    }

    // Busca fertirrigações
    const fertirrigacoes = await this.prismaClient.fertirrigacao.findMany({
      where: {
        setor_id: setorId,
        created_at: {
          gte: dataInicio,
          lte: dataFim
        }
      },
      include: {
        produtos: {
          include: {
            produto: true
          }
        }
      }
    });

    // Converte aplicações para formato padronizado
    for (const aplicacao of aplicacoes) {
      let produtosAplicados: any[] = [];
      
      try {
        // Verifica se produtosAplicados é string ou já é objeto
        if (typeof aplicacao.produtosAplicados === 'string') {
          produtosAplicados = JSON.parse(aplicacao.produtosAplicados);
        } else if (Array.isArray(aplicacao.produtosAplicados)) {
          produtosAplicados = aplicacao.produtosAplicados;
        } else if (aplicacao.produtosAplicados && typeof aplicacao.produtosAplicados === 'object') {
          produtosAplicados = [aplicacao.produtosAplicados];
        }
      } catch (error) {
        console.warn('Erro ao fazer parse de produtosAplicados:', error);
        produtosAplicados = [];
      }
      
      // Busca nomes dos produtos no banco
      const produtosComNomes = await Promise.all(
        produtosAplicados.map(async (produto: { produto: string; dosagem: number }) => {
          try {
            const produtoInfo = await this.prismaClient.product.findUnique({
              where: { id: produto.produto },
              select: { name: true, unit: true }
            });
            
            return {
              produtoId: produto.produto,
              nome: produtoInfo?.name || produto.produto, // Usa nome do banco ou ID como fallback
              quantidade: produto.dosagem,
              unidade: produtoInfo?.unit || 'L' // Usa unidade do banco ou 'L' como fallback
            };
          } catch (error) {
            console.warn(`Erro ao buscar produto ${produto.produto}:`, error);
            return {
              produtoId: produto.produto,
              nome: produto.produto, // Fallback para ID
              quantidade: produto.dosagem,
              unidade: 'L'
            };
          }
        })
      );
      
      historico.push({
        id: aplicacao.id,
        setorId: aplicacao.setorId!,
        dataAplicacao: aplicacao.createdAt,
        faseFenologica: 'Desconhecida', // Será calculada posteriormente
        tipo: 'pulverizacao',
        produtos: produtosComNomes,
        volumeCalda: aplicacao.volumeCalda
      });
    }

    // Converte fertirrigações para formato padronizado
    for (const fertirrigacao of fertirrigacoes) {
      historico.push({
        id: fertirrigacao.id,
        setorId: fertirrigacao.setor_id,
        dataAplicacao: fertirrigacao.created_at,
        faseFenologica: 'Desconhecida', // Será calculada posteriormente
        tipo: 'fertirrigacao',
        produtos: fertirrigacao.produtos.map((produto: { produto_id: string; quantidade: number; produto: { name: string; unit: string } }) => ({
          produtoId: produto.produto_id,
          nome: produto.produto.name,
          quantidade: produto.quantidade,
          unidade: produto.produto.unit
        }))
      });
    }

    return historico.sort((a, b) => a.dataAplicacao.getTime() - b.dataAplicacao.getTime());
  }

  async buscarDadosSetor(setorId: string): Promise<DadosSetor | null> {
    const setor = await this.prismaClient.setor.findUnique({
      where: { id: setorId },
      include: {
        variedade: true,
        fazenda: true
      }
    });

    if (!setor) return null;

    // Busca histórico dos últimos 2 anos
    const dataInicio = new Date();
    dataInicio.setFullYear(dataInicio.getFullYear() - 2);

    const historicoAplicacoes = await this.buscarHistoricoAplicacoes(
      setorId, 
      dataInicio, 
      new Date()
    );

    return {
      id: setor.id,
      nome: setor.setorName,
      dataPoda: setor.dataPoda,
      faseAtual: null, // Será calculada posteriormente
      diasAposPoda: 0, // Será calculado posteriormente
      variedade: setor.variedade.nome,
      area: setor.tamanhoArea,
      historicoAplicacoes
    };
  }

  async buscarHistoricoCompletoFazenda(
    fazendaId: string, 
    dataInicio: Date, 
    dataFim: Date
  ): Promise<DadosSetor[]> {
    const setores = await this.prismaClient.setor.findMany({
      where: { fazenda_id: fazendaId },
      include: {
        variedade: true,
        fazenda: true
      }
    });

    const dadosSetores: DadosSetor[] = [];

    for (const setor of setores) {
      const historicoAplicacoes = await this.buscarHistoricoAplicacoes(
        setor.id, 
        dataInicio, 
        dataFim
      );

      dadosSetores.push({
        id: setor.id,
        nome: setor.setorName,
        dataPoda: setor.dataPoda,
        faseAtual: null, // Será calculada posteriormente
        diasAposPoda: 0, // Será calculado posteriormente
        variedade: setor.variedade.nome,
        area: setor.tamanhoArea,
        historicoAplicacoes
      });
    }

    return dadosSetores;
  }

  async buscarPadroesGlobaisPorFase(
    fazendaId: string,
    faseFenologica: string,
    dataInicio: Date,
    dataFim: Date
  ): Promise<HistoricoAplicacao[]> {
    console.log(`Buscando padrões globais para fase: ${faseFenologica} na fazenda: ${fazendaId}`);
    
    const historico: HistoricoAplicacao[] = [];

    // Busca aplicações de pulverização de todos os setores da fazenda
    const aplicacoes = await this.prismaClient.aplicacao.findMany({
      where: {
        setor: {
          fazendaId
        },
        createdAt: {
          gte: dataInicio,
          lte: dataFim
        }
      },
      include: {
        setor: true,
        saidas: {
          include: {
            Product: true
          }
        }
      }
    });

    console.log(`Aplicações de pulverização encontradas: ${aplicacoes.length}`);

    for (const aplicacao of aplicacoes) {
      let produtosAplicados: any[] = [];
      
      try {
        if (typeof aplicacao.produtosAplicados === 'string') {
          produtosAplicados = JSON.parse(aplicacao.produtosAplicados);
        } else if (Array.isArray(aplicacao.produtosAplicados)) {
          produtosAplicados = aplicacao.produtosAplicados;
        } else if (aplicacao.produtosAplicados && typeof aplicacao.produtosAplicados === 'object') {
          produtosAplicados = [aplicacao.produtosAplicados];
        }
      } catch (error) {
        console.warn('Erro ao fazer parse de produtosAplicados:', error);
        produtosAplicados = [];
      }

      // Busca nomes dos produtos no banco
      const produtosComNomes = await Promise.all(
        produtosAplicados.map(async (produto: { produto: string; dosagem: number }) => {
          try {
            const produtoInfo = await this.prismaClient.product.findUnique({
              where: { id: produto.produto },
              select: { name: true, unit: true }
            });
            
            return {
              produtoId: produto.produto,
              nome: produtoInfo?.name || produto.produto,
              quantidade: produto.dosagem,
              unidade: produtoInfo?.unit || 'L'
            };
          } catch (error) {
            console.warn(`Erro ao buscar produto ${produto.produto}:`, error);
            return {
              produtoId: produto.produto,
              nome: produto.produto,
              quantidade: produto.dosagem,
              unidade: 'L'
            };
          }
        })
      );

      historico.push({
        id: aplicacao.id,
        setorId: aplicacao.setorId!,
        dataAplicacao: aplicacao.createdAt,
        faseFenologica: faseFenologica, // Usa a fase fornecida
        tipo: 'pulverizacao',
        produtos: produtosComNomes,
        volumeCalda: aplicacao.volumeCalda
      });
    }

    // Busca fertirrigações de todos os setores da fazenda
    const fertirrigacoes = await this.prismaClient.fertirrigacao.findMany({
      where: {
        setor: {
          fazendaId
        },
        createdAt: {
          gte: dataInicio,
          lte: dataFim
        }
      },
      include: {
        setor: true,
        produtos: {
          include: {
            produto: true
          }
        }
      }
    });

    console.log(`Fertirrigações encontradas: ${fertirrigacoes.length}`);

    for (const fertirrigacao of fertirrigacoes) {
      historico.push({
        id: fertirrigacao.id,
        setorId: fertirrigacao.setorId!,
        dataAplicacao: fertirrigacao.createdAt,
        faseFenologica: faseFenologica, // Usa a fase fornecida
        tipo: 'fertirrigacao',
        produtos: fertirrigacao.produtos.map((produto: { produto_id: string; quantidade: number; produto: { name: string; unit: string } }) => ({
          produtoId: produto.produto_id,
          nome: produto.produto.name,
          quantidade: produto.quantidade,
          unidade: produto.produto.unit
        }))
      });
    }

    console.log(`Total de aplicações globais para fase ${faseFenologica}: ${historico.length}`);
    return historico;
  }
}
