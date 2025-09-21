import { FASES_PLANTAS } from '../constants/fases';
import { FasePlanta } from '../@types/phases';

export class FaseRetroativaService {
  private readonly CICLO_CULTIVO_DAYS = 120; // Média de tempo de cultivo

  /**
   * Calcula a fase fenológica retroativa baseada na data de poda e dias atrás
   */
  public calcularFaseRetroativa(dataPoda: Date, diasAtras: number): string | null {
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
  public gerarDatasPodaRetroativas(dataPodaAtual: Date, diasAtras: number): Date[] {
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
   * Calcula a fase fenológica para uma data específica baseada na data de poda
   */
  public calcularFaseParaData(dataPoda: Date, dataAplicacao: Date): string | null {
    const diasAposPoda = Math.floor(
      (dataAplicacao.getTime() - dataPoda.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (diasAposPoda < 0) return null;
    
    const fase = FASES_PLANTAS.find(f => 
      diasAposPoda >= f.diasInicio && diasAposPoda <= f.diasFim
    );
    
    return fase?.nome || null;
  }

  /**
   * Calcula múltiplas fases retroativas para um conjunto de datas
   */
  public calcularFasesRetroativas(
    dataPoda: Date, 
    datasAplicacao: Date[]
  ): Map<Date, string | null> {
    const fases = new Map<Date, string | null>();
    
    datasAplicacao.forEach(dataAplicacao => {
      const fase = this.calcularFaseParaData(dataPoda, dataAplicacao);
      fases.set(dataAplicacao, fase);
    });
    
    return fases;
  }

  /**
   * Estima a data de poda baseada na fase atual e dias desde a poda
   */
  public estimarDataPoda(faseAtual: string, diasAposPoda: number): Date | null {
    const fase = FASES_PLANTAS.find(f => f.nome === faseAtual);
    if (!fase) return null;

    const hoje = new Date();
    const diasCorrigidos = Math.max(fase.diasInicio, Math.min(fase.diasFim, diasAposPoda));
    const dataPodaEstimada = new Date(hoje);
    dataPodaEstimada.setDate(dataPodaEstimada.getDate() - diasCorrigidos);
    
    return dataPodaEstimada;
  }

  /**
   * Valida se uma fase é consistente com o tempo decorrido desde a poda
   */
  public validarConsistenciaFase(
    dataPoda: Date, 
    faseAtual: string, 
    diasAposPoda: number
  ): boolean {
    const fase = FASES_PLANTAS.find(f => f.nome === faseAtual);
    if (!fase) return false;

    return diasAposPoda >= fase.diasInicio && diasAposPoda <= fase.diasFim;
  }

  /**
   * Calcula a próxima fase fenológica baseada na fase atual
   */
  public calcularProximaFase(faseAtual: string): string | null {
    const indiceAtual = FASES_PLANTAS.findIndex(f => f.nome === faseAtual);
    if (indiceAtual === -1 || indiceAtual >= FASES_PLANTAS.length - 1) {
      return null;
    }

    return FASES_PLANTAS[indiceAtual + 1].nome;
  }

  /**
   * Calcula a fase anterior baseada na fase atual
   */
  public calcularFaseAnterior(faseAtual: string): string | null {
    const indiceAtual = FASES_PLANTAS.findIndex(f => f.nome === faseAtual);
    if (indiceAtual <= 0) {
      return null;
    }

    return FASES_PLANTAS[indiceAtual - 1].nome;
  }

  /**
   * Calcula o progresso percentual dentro de uma fase
   */
  public calcularProgressoFase(faseAtual: string, diasAposPoda: number): number {
    const fase = FASES_PLANTAS.find(f => f.nome === faseAtual);
    if (!fase) return 0;

    const duracaoFase = fase.diasFim - fase.diasInicio;
    const diasNaFase = diasAposPoda - fase.diasInicio;
    
    return Math.min(100, Math.max(0, (diasNaFase / duracaoFase) * 100));
  }
}
