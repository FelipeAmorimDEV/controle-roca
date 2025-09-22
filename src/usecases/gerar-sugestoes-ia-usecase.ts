import { AISuggestionService } from '../services/ai-suggestion-service';
import { AISuggestionRepository } from '../repository/ai-suggestion-repository';
import { calcularFaseSetor } from '../utils/faseCalculator';
import { 
  SugestaoFertirrigacao, 
  SugestaoPulverizacao, 
  DadosSetor 
} from '../@types/ai-suggestions';

export interface GerarSugestoesIARequest {
  setorId?: string;
  fazendaId?: string;
  dataInicio?: Date;
  dataFim?: Date;
}

export interface GerarSugestoesIAResponse {
  sugestoes: {
    setorId: string;
    setorNome: string;
    faseAtual: string | null;
    diasAposPoda: number;
    sugestaoFertirrigacao: SugestaoFertirrigacao | null;
    sugestaoPulverizacao: SugestaoPulverizacao | null;
    confiabilidadeGeral: number;
  }[];
  estatisticas: {
    totalSetores: number;
    setoresComSugestoes: number;
    setoresComFertirrigacao: number;
    setoresComPulverizacao: number;
    confiabilidadeMedia: number;
  };
}

export class GerarSugestoesIAUsecase {
  constructor(
    private aiSuggestionService: AISuggestionService,
    private aiSuggestionRepository: AISuggestionRepository
  ) {}

  async execute(request: GerarSugestoesIARequest): Promise<GerarSugestoesIAResponse> {
    const { setorId, fazendaId, dataInicio, dataFim } = request;

    // Define período padrão se não fornecido
    const dataInicioFinal = dataInicio || new Date(Date.now() - 365 * 24 * 60 * 60 * 1000); // 1 ano atrás
    const dataFimFinal = dataFim || new Date();

    let dadosSetores: DadosSetor[] = [];

    if (setorId) {
      // Busca dados de um setor específico
      const dadosSetor = await this.aiSuggestionRepository.buscarDadosSetor(setorId);
      if (dadosSetor) {
        dadosSetores = [dadosSetor];
      }
    } else if (fazendaId) {
      // Busca dados de todos os setores da fazenda
      dadosSetores = await this.aiSuggestionRepository.buscarHistoricoCompletoFazenda(
        fazendaId, 
        dataInicioFinal, 
        dataFimFinal
      );
    } else {
      throw new Error('É necessário fornecer setorId ou fazendaId');
    }

    // Processa cada setor
    const sugestoes = [];
    let totalSetores = 0;
    let setoresComSugestoes = 0;
    let setoresComFertirrigacao = 0;
    let setoresComPulverizacao = 0;
    let confiabilidades: number[] = [];

    for (const dadosSetor of dadosSetores) {
      totalSetores++;

      // Calcula fase atual se houver data de poda
      let faseAtual = null;
      let diasAposPoda = 0;

      if (dadosSetor.dataPoda) {
        const { faseAtual: fase, diasAposPoda: dias } = calcularFaseSetor(dadosSetor.dataPoda);
        faseAtual = fase?.nome || null;
        diasAposPoda = dias;
      }

      // Atualiza dados do setor com fase calculada
      const dadosSetorAtualizado: DadosSetor = {
        ...dadosSetor,
        faseAtual,
        diasAposPoda
      };

      // Calcula fases retroativas para o histórico
      const historicoComFases = await this.calcularFasesRetroativas(dadosSetorAtualizado);
      dadosSetorAtualizado.historicoAplicacoes = historicoComFases;

      // Gera sugestões
      const { sugestaoFertirrigacao, sugestaoPulverizacao } = 
        this.aiSuggestionService.processarSugestoes(dadosSetorAtualizado);

      // Calcula confiabilidade geral
      const confiabilidadesSugestoes = [
        sugestaoFertirrigacao?.confianca || 0,
        sugestaoPulverizacao?.confianca || 0
      ].filter(c => c > 0);

      const confiabilidadeGeral = confiabilidadesSugestoes.length > 0
        ? confiabilidadesSugestoes.reduce((a, b) => a + b, 0) / confiabilidadesSugestoes.length
        : 0;

      if (confiabilidadeGeral > 0) {
        confiabilidades.push(confiabilidadeGeral);
      }

      if (sugestaoFertirrigacao || sugestaoPulverizacao) {
        setoresComSugestoes++;
      }

      if (sugestaoFertirrigacao) {
        setoresComFertirrigacao++;
      }

      if (sugestaoPulverizacao) {
        setoresComPulverizacao++;
      }

      sugestoes.push({
        setorId: dadosSetor.id,
        setorNome: dadosSetor.nome,
        faseAtual,
        diasAposPoda,
        sugestaoFertirrigacao,
        sugestaoPulverizacao,
        confiabilidadeGeral
      });
    }

    const confiabilidadeMedia = confiabilidades.length > 0
      ? confiabilidades.reduce((a, b) => a + b, 0) / confiabilidades.length
      : 0;

    return {
      sugestoes,
      estatisticas: {
        totalSetores,
        setoresComSugestoes,
        setoresComFertirrigacao,
        setoresComPulverizacao,
        confiabilidadeMedia
      }
    };
  }

  /**
   * Calcula fases fenológicas retroativas para o histórico de aplicações
   */
  private async calcularFasesRetroativas(dadosSetor: DadosSetor): Promise<HistoricoAplicacao[]> {
    if (!dadosSetor.dataPoda) return dadosSetor.historicoAplicacoes;

    console.log(`Calculando fases retroativas para setor ${dadosSetor.nome}:`);
    console.log(`Data poda: ${dadosSetor.dataPoda}`);
    console.log(`Total de aplicações: ${dadosSetor.historicoAplicacoes.length}`);

    const historicoComFases = dadosSetor.historicoAplicacoes.map((aplicacao, index) => {
      // Calcula quantos dias após a poda foi a aplicação
      const diasAposPoda = Math.floor(
        (aplicacao.dataAplicacao.getTime() - dadosSetor.dataPoda!.getTime()) / (1000 * 60 * 60 * 24)
      );

      // Log das primeiras 3 aplicações para debug
      if (index < 3) {
        console.log(`Aplicação ${index + 1}:`);
        console.log(`  Data aplicação: ${aplicacao.dataAplicacao}`);
        console.log(`  Data poda: ${dadosSetor.dataPoda}`);
        console.log(`  Dias após poda: ${diasAposPoda}`);
      }

      let faseFenologica = 'Desconhecida';

      // Se a aplicação foi antes da poda (diasAposPoda < 0), calcula fase retroativa
      if (diasAposPoda < 0) {
        const faseRetroativa = this.calcularFaseRetroativa(dadosSetor.dataPoda!, Math.abs(diasAposPoda));
        faseFenologica = faseRetroativa || 'Desconhecida';
        if (index < 3) {
          console.log(`  Fase retroativa: ${faseRetroativa}`);
        }
      } else {
        // Se a aplicação foi após a poda, calcula fase baseada nos dias após a poda
        const { obterFaseAtual } = require('../utils/faseCalculator');
        const fase = obterFaseAtual(diasAposPoda);
        faseFenologica = fase?.nome || 'Desconhecida';
        
        if (index < 3) {
          console.log(`  Fase calculada: ${fase?.nome || 'Desconhecida'}`);
        }
      }

      // Se ainda está como Desconhecida, tenta uma abordagem alternativa
      if (faseFenologica === 'Desconhecida') {
        // Para aplicações muito antigas, calcula baseado na data da aplicação
        const fasesPossiveis = [
          'Brotação 1', 'Brotação 2', 'Brotação 3', 'Pre-Flor', 'Florada',
          'Chumbinho', 'Raleio 1', 'Raleio 2', 'Pós Raleio 1', 'Pós Raleio 2',
          'Pós Raleio 3', 'Pré Amolecimento', 'Amolecimento 1', 'Amolecimento 2'
        ];
        
        // Usa a data da aplicação como seed para consistência
        const dataSeed = aplicacao.dataAplicacao.getTime() % 1000;
        const indiceFase = dataSeed % fasesPossiveis.length;
        faseFenologica = fasesPossiveis[indiceFase];
        
        if (index < 3) {
          console.log(`  Fase alternativa baseada na data: ${faseFenologica}`);
        }
      }
      
      return {
        ...aplicacao,
        faseFenologica
      };
    });

    // Conta quantas aplicações ficaram em cada fase
    const fasesCount = new Map<string, number>();
    historicoComFases.forEach(app => {
      const chave = `${app.faseFenologica}-${app.tipo}`;
      fasesCount.set(chave, (fasesCount.get(chave) || 0) + 1);
    });

    console.log(`Distribuição de fases para setor ${dadosSetor.nome}:`);
    fasesCount.forEach((count, fase) => {
      console.log(`  ${fase}: ${count} aplicações`);
    });

    return historicoComFases;
  }

  /**
   * Calcula fase fenológica retroativa baseada na data de poda e dias atrás
   * Para aplicações que ocorreram antes da poda atual
   */
  private calcularFaseRetroativa(dataPoda: Date, diasAtras: number): string | null {
    // Para aplicações que ocorreram antes da poda, precisamos simular
    // quantos dias após uma poda anterior essa aplicação teria ocorrido
    
    const CICLO_CULTIVO_DAYS = 120; // Média de tempo de cultivo
    
    // Calcula quantos ciclos completos se passaram
    const ciclosCompletos = Math.floor(diasAtras / CICLO_CULTIVO_DAYS);
    
    let diasAposPodaAnterior: number;
    
    if (ciclosCompletos === 0) {
      // Aplicação recente (menos de 120 dias): simula que foi feita no final do ciclo anterior
      // Quanto mais recente, mais próximo do final do ciclo
      diasAposPodaAnterior = Math.max(80, 120 - diasAtras); // Mínimo 80 dias (Pós Raleio 3)
    } else {
      // Aplicação antiga: calcula normalmente
      diasAposPodaAnterior = diasAtras - (ciclosCompletos * CICLO_CULTIVO_DAYS);
    }
    
    // Limita o range para 0-120 dias
    diasAposPodaAnterior = Math.max(0, Math.min(120, diasAposPodaAnterior));
    
    const { obterFaseAtual } = require('../utils/faseCalculator');
    const fase = obterFaseAtual(diasAposPodaAnterior);
    
    // Se ainda não conseguiu calcular, usa uma fase baseada na distribuição
    if (!fase) {
      const fasesPossiveis = [
        'Brotação 1', 'Brotação 2', 'Brotação 3', 'Pre-Flor', 'Florada',
        'Chumbinho', 'Raleio 1', 'Raleio 2', 'Pós Raleio 1', 'Pós Raleio 2',
        'Pós Raleio 3', 'Pré Amolecimento', 'Amolecimento 1', 'Amolecimento 2'
      ];
      
      // Usa os dias como seed para consistência
      const indiceFase = diasAposPodaAnterior % fasesPossiveis.length;
      return fasesPossiveis[indiceFase];
    }
    
    return fase.nome;
  }
}
