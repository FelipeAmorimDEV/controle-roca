import { FASES_PLANTAS } from '../constants/fases';
import { 
  SugestaoFertirrigacao, 
  SugestaoPulverizacao, 
  HistoricoAplicacao, 
  PadraoAplicacao, 
  DadosSetor 
} from '../@types/ai-suggestions';
import { FasePlanta } from '../@types/phases';

export class AISuggestionService {
  private readonly CICLO_CULTIVO_DAYS = 120; // Média de tempo de cultivo
  private readonly MIN_HISTORICO_APLICACOES = 3; // Mínimo de aplicações para análise confiável

  /**
   * Calcula a fase fenológica retroativa baseada na data de poda e ciclo de cultivo
   */
  private calcularFaseRetroativa(dataPoda: Date, diasAtras: number): string | null {
    const diasAposPoda = Math.floor((Date.now() - dataPoda.getTime()) / (1000 * 60 * 60 * 24));
    const diasRetroativos = diasAposPoda - diasAtras;
    
    if (diasRetroativos < 0) return null;
    
    const fase = FASES_PLANTAS.find(f => 
      diasRetroativos >= f.diasInicio && diasRetroativos <= f.diasFim
    );
    
    return fase?.nome || null;
  }

  /**
   * Gera datas de poda retroativas baseadas no ciclo de cultivo
   */
  private gerarDatasPodaRetroativas(dataPodaAtual: Date, diasAtras: number): Date[] {
    const datas: Date[] = [];
    const ciclosCompletos = Math.floor(diasAtras / this.CICLO_CULTIVO_DAYS);
    
    for (let i = 1; i <= ciclosCompletos; i++) {
      const dataRetroativa = new Date(dataPodaAtual);
      dataRetroativa.setDate(dataRetroativa.getDate() - (i * this.CICLO_CULTIVO_DAYS));
      datas.push(dataRetroativa);
    }
    
    return datas;
  }

  /**
   * Analisa padrões de aplicações por fase fenológica
   */
  private analisarPadroesAplicacoes(historico: HistoricoAplicacao[]): Map<string, PadraoAplicacao> {
    const padroes = new Map<string, PadraoAplicacao>();
    
    // Agrupa aplicações por fase fenológica e tipo
    const aplicacoesPorFase = new Map<string, HistoricoAplicacao[]>();
    
    historico.forEach(aplicacao => {
      const chave = `${aplicacao.faseFenologica}-${aplicacao.tipo}`;
      if (!aplicacoesPorFase.has(chave)) {
        aplicacoesPorFase.set(chave, []);
      }
      aplicacoesPorFase.get(chave)!.push(aplicacao);
    });

    // Calcula padrões para cada fase
    aplicacoesPorFase.forEach((aplicacoes, chave) => {
      if (aplicacoes.length < this.MIN_HISTORICO_APLICACOES) return;

      const [faseFenologica, tipo] = chave.split('-');
      
      // Calcula frequência média
      const datas = aplicacoes.map(a => a.dataAplicacao).sort((a, b) => a.getTime() - b.getTime());
      const intervalos = [];
      for (let i = 1; i < datas.length; i++) {
        const diff = Math.floor((datas[i].getTime() - datas[i-1].getTime()) / (1000 * 60 * 60 * 24));
        intervalos.push(diff);
      }
      const frequenciaMedia = intervalos.length > 0 
        ? intervalos.reduce((a, b) => a + b, 0) / intervalos.length 
        : 0;

      // Calcula médias de produtos
      const produtosMap = new Map<string, { quantidades: number[], unidades: string[] }>();
      
      aplicacoes.forEach(aplicacao => {
        aplicacao.produtos.forEach(produto => {
          if (!produtosMap.has(produto.produtoId)) {
            produtosMap.set(produto.produtoId, { quantidades: [], unidades: [] });
          }
          const dados = produtosMap.get(produto.produtoId)!;
          dados.quantidades.push(produto.quantidade);
          dados.unidades.push(produto.unidade);
        });
      });

      const produtos = Array.from(produtosMap.entries()).map(([produtoId, dados]) => {
        const quantidadeMedia = dados.quantidades.reduce((a, b) => a + b, 0) / dados.quantidades.length;
        const variacao = this.calcularVariacao(dados.quantidades);
        
        return {
          produtoId,
          nome: aplicacoes[0].produtos.find(p => p.produtoId === produtoId)?.nome || '',
          quantidadeMedia,
          unidade: dados.unidades[0],
          variacao
        };
      });

      // Calcula volume médio de calda (se aplicável)
      const volumesCalda = aplicacoes
        .filter(a => a.volumeCalda)
        .map(a => a.volumeCalda!);
      const volumeCalda = volumesCalda.length > 0 
        ? volumesCalda.reduce((a, b) => a + b, 0) / volumesCalda.length 
        : undefined;

      // Calcula variação média dos produtos para confiabilidade
      const variacoesProdutos = produtos.map(p => p.variacao);
      const variacaoMedia = variacoesProdutos.length > 0 
        ? variacoesProdutos.reduce((a, b) => a + b, 0) / variacoesProdutos.length 
        : 0;

      // Calcula confiabilidade baseada na consistência dos dados
      const confiabilidade = this.calcularConfiabilidade(aplicacoes.length, variacaoMedia);

      padroes.set(chave, {
        faseFenologica,
        tipo: tipo as 'fertirrigacao' | 'pulverizacao',
        frequenciaMedia,
        produtos,
        volumeCalda,
        confiabilidade
      });
    });

    return padroes;
  }

  /**
   * Calcula a variação percentual de um conjunto de valores
   */
  private calcularVariacao(valores: number[]): number {
    if (valores.length <= 1) return 0;
    
    const media = valores.reduce((a, b) => a + b, 0) / valores.length;
    const variancia = valores.reduce((acc, val) => acc + Math.pow(val - media, 2), 0) / valores.length;
    const desvioPadrao = Math.sqrt(variancia);
    
    return (desvioPadrao / media) * 100;
  }

  /**
   * Calcula a confiabilidade baseada no número de amostras e consistência
   */
  private calcularConfiabilidade(numAmostras: number, variacao: number): number {
    let confiabilidade = Math.min(numAmostras * 10, 80); // Base: até 80% por amostras
    
    // Penaliza alta variação
    if (variacao > 50) confiabilidade -= 20;
    else if (variacao > 30) confiabilidade -= 10;
    
    return Math.max(0, Math.min(100, confiabilidade));
  }

  /**
   * Gera sugestões de fertirrigação baseadas no histórico e fase atual
   */
  public gerarSugestaoFertirrigacao(
    dadosSetor: DadosSetor, 
    padroes: Map<string, PadraoAplicacao>
  ): SugestaoFertirrigacao | null {
    if (!dadosSetor.faseAtual) return null;

    const chave = `${dadosSetor.faseAtual}-fertirrigacao`;
    const padrao = padroes.get(chave);
    
    if (!padrao || padrao.confiabilidade < 30) return null;

    // Verifica se já houve aplicação recente
    const ultimaAplicacao = dadosSetor.historicoAplicacoes
      .filter(h => h.tipo === 'fertirrigacao')
      .sort((a, b) => b.dataAplicacao.getTime() - a.dataAplicacao.getTime())[0];

    if (ultimaAplicacao) {
      const diasDesdeUltima = Math.floor(
        (Date.now() - ultimaAplicacao.dataAplicacao.getTime()) / (1000 * 60 * 60 * 24)
      );
      
      if (diasDesdeUltima < padrao.frequenciaMedia * 0.8) {
        return null; // Muito recente para nova aplicação
      }
    }

    const dataSugerida = new Date();
    dataSugerida.setDate(dataSugerida.getDate() + Math.floor(padrao.frequenciaMedia * 0.2));

    const produtos = padrao.produtos.map(produto => ({
      produtoId: produto.produtoId,
      nome: produto.nome,
      quantidade: this.aplicarVariacao(produto.quantidadeMedia, produto.variacao),
      unidade: produto.unidade,
      justificativa: `Baseado em ${dadosSetor.historicoAplicacoes.length} aplicações históricas na fase ${dadosSetor.faseAtual}`
    }));

    return {
      id: `fert-${Date.now()}`,
      setorId: dadosSetor.id,
      faseFenologica: dadosSetor.faseAtual,
      produtos,
      dataSugerida,
      confianca: padrao.confiabilidade,
      observacoes: `Sugestão baseada em padrões históricos. Confiabilidade: ${padrao.confiabilidade}%`
    };
  }

  /**
   * Gera sugestões de pulverização baseadas no histórico e fase atual
   */
  public gerarSugestaoPulverizacao(
    dadosSetor: DadosSetor, 
    padroes: Map<string, PadraoAplicacao>
  ): SugestaoPulverizacao | null {
    if (!dadosSetor.faseAtual) return null;

    const chave = `${dadosSetor.faseAtual}-pulverizacao`;
    const padrao = padroes.get(chave);
    
    if (!padrao || padrao.confiabilidade < 30) return null;

    // Verifica se já houve aplicação recente
    const ultimaAplicacao = dadosSetor.historicoAplicacoes
      .filter(h => h.tipo === 'pulverizacao')
      .sort((a, b) => b.dataAplicacao.getTime() - a.dataAplicacao.getTime())[0];

    if (ultimaAplicacao) {
      const diasDesdeUltima = Math.floor(
        (Date.now() - ultimaAplicacao.dataAplicacao.getTime()) / (1000 * 60 * 60 * 24)
      );
      
      if (diasDesdeUltima < padrao.frequenciaMedia * 0.8) {
        return null; // Muito recente para nova aplicação
      }
    }

    const dataSugerida = new Date();
    dataSugerida.setDate(dataSugerida.getDate() + Math.floor(padrao.frequenciaMedia * 0.2));

    const produtos = padrao.produtos.map(produto => ({
      produtoId: produto.produtoId,
      nome: produto.nome,
      dosagem: this.aplicarVariacao(produto.quantidadeMedia, produto.variacao),
      unidade: produto.unidade,
      justificativa: `Baseado em ${dadosSetor.historicoAplicacoes.length} aplicações históricas na fase ${dadosSetor.faseAtual}`
    }));

    return {
      id: `pulv-${Date.now()}`,
      setorId: dadosSetor.id,
      faseFenologica: dadosSetor.faseAtual,
      produtos,
      volumeCalda: padrao.volumeCalda || 100, // Valor padrão se não houver histórico
      dataSugerida,
      confianca: padrao.confiabilidade,
      observacoes: `Sugestão baseada em padrões históricos. Confiabilidade: ${padrao.confiabilidade}%`
    };
  }

  /**
   * Aplica variação aleatória controlada a uma quantidade
   */
  private aplicarVariacao(valor: number, variacao: number): number {
    const variacaoReal = Math.min(variacao, 20); // Limita a 20% de variação
    const fator = 1 + (Math.random() - 0.5) * (variacaoReal / 100);
    return Math.round(valor * fator * 100) / 100;
  }

  /**
   * Processa dados do setor e gera sugestões
   */
  public processarSugestoes(dadosSetor: DadosSetor): {
    sugestaoFertirrigacao: SugestaoFertirrigacao | null;
    sugestaoPulverizacao: SugestaoPulverizacao | null;
    padroes: Map<string, PadraoAplicacao>;
  } {
    const padroes = this.analisarPadroesAplicacoes(dadosSetor.historicoAplicacoes);
    
    const sugestaoFertirrigacao = this.gerarSugestaoFertirrigacao(dadosSetor, padroes);
    const sugestaoPulverizacao = this.gerarSugestaoPulverizacao(dadosSetor, padroes);

    return {
      sugestaoFertirrigacao,
      sugestaoPulverizacao,
      padroes
    };
  }
}
