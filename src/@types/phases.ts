export interface FasePlanta {
  nome: string;
  diasInicio: number;
  diasFim: number;
  cor: string;
  descricao: string;
}

// Tipo estendido que inclui todos os dados do setor + fases
export interface SetorComFases {
  id: string;
  setorName: string;
  filas: string;
  tamanhoArea: number;
  variedade_id: number;
  fazenda_id: string;
  dataPoda: Date | null;
  // Campos calculados
  faseAtual: FasePlanta | null;
  diasAposPoda: number;
  // Relacionamentos (se incluídos)
  variedade?: any;
  fazenda?: any;
}