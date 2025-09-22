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

    const historicoComFases = dadosSetor.historicoAplicacoes.map(aplicacao => {
      // Calcula quantos dias após a poda foi a aplicação
      const diasAposPoda = Math.floor(
        (aplicacao.dataAplicacao.getTime() - dadosSetor.dataPoda!.getTime()) / (1000 * 60 * 60 * 24)
      );

      // Se a aplicação foi antes da poda (diasAposPoda < 0), calcula fase retroativa
      if (diasAposPoda < 0) {
        const faseRetroativa = this.calcularFaseRetroativa(dadosSetor.dataPoda!, Math.abs(diasAposPoda));
        return {
          ...aplicacao,
          faseFenologica: faseRetroativa || 'Desconhecida'
        };
      }

      // Se a aplicação foi após a poda, calcula fase baseada nos dias após a poda
      const { obterFaseAtual } = require('../utils/faseCalculator');
      const fase = obterFaseAtual(diasAposPoda);
      
      return {
        ...aplicacao,
        faseFenologica: fase?.nome || 'Desconhecida'
      };
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
    
    if (ciclosCompletos === 0) {
      // Se foi menos de um ciclo, não conseguimos calcular fase retroativa
      return null;
    }
    
    // Simula a data de poda anterior
    const dataPodaAnterior = new Date(dataPoda);
    dataPodaAnterior.setDate(dataPodaAnterior.getDate() - (ciclosCompletos * CICLO_CULTIVO_DAYS));
    
    // Calcula quantos dias após essa poda anterior a aplicação teria ocorrido
    const diasAposPodaAnterior = diasAtras - (ciclosCompletos * CICLO_CULTIVO_DAYS);
    
    if (diasAposPodaAnterior < 0 || diasAposPodaAnterior > 120) {
      return null; // Fora do ciclo de cultivo
    }
    
    const { obterFaseAtual } = require('../utils/faseCalculator');
    const fase = obterFaseAtual(diasAposPodaAnterior);
    
    return fase?.nome || null;
  }
}
