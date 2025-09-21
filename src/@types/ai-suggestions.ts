export interface SugestaoFertirrigacao {
  id: string;
  setorId: string;
  faseFenologica: string;
  produtos: {
    produtoId: string;
    nome: string;
    quantidade: number;
    unidade: string;
    justificativa: string;
  }[];
  dataSugerida: Date;
  confianca: number; // 0-100
  observacoes: string;
}

export interface SugestaoPulverizacao {
  id: string;
  setorId: string;
  faseFenologica: string;
  produtos: {
    produtoId: string;
    nome: string;
    dosagem: number;
    unidade: string;
    justificativa: string;
  }[];
  volumeCalda: number;
  dataSugerida: Date;
  confianca: number; // 0-100
  observacoes: string;
}

export interface HistoricoAplicacao {
  id: string;
  setorId: string;
  dataAplicacao: Date;
  faseFenologica: string;
  tipo: 'fertirrigacao' | 'pulverizacao';
  produtos: {
    produtoId: string;
    nome: string;
    quantidade: number;
    unidade: string;
  }[];
  volumeCalda?: number;
}

export interface PadraoAplicacao {
  faseFenologica: string;
  tipo: 'fertirrigacao' | 'pulverizacao';
  frequenciaMedia: number; // dias entre aplicações
  produtos: {
    produtoId: string;
    nome: string;
    quantidadeMedia: number;
    unidade: string;
    variacao: number; // % de variação aceitável
  }[];
  volumeCalda?: number;
  confiabilidade: number; // 0-100 baseado no histórico
}

export interface DadosSetor {
  id: string;
  nome: string;
  dataPoda: Date | null;
  faseAtual: string | null;
  diasAposPoda: number;
  variedade: string;
  area: number;
  historicoAplicacoes: HistoricoAplicacao[];
}
