import { FasePlanta } from "@/@types/phases";

export const FASES_PLANTAS: FasePlanta[] = [
  {
    nome: "Poda",
    diasInicio: 0,
    diasFim: 8,
    cor: "#8B4513",
    descricao: "Período logo após a poda, início do ciclo de crescimento"
  },
  {
    nome: "Brotação 1",
    diasInicio: 9,
    diasFim: 14,
    cor: "#90EE90",
    descricao: "Primeira brotação das plantas, surgimento dos primeiros brotos"
  },
  {
    nome: "Brotação 2",
    diasInicio: 15,
    diasFim: 21,
    cor: "#32CD32",
    descricao: "Segunda fase de brotação, desenvolvimento inicial das folhas"
  },
  {
    nome: "Brotação 3",
    diasInicio: 22,
    diasFim: 28,
    cor: "#228B22",
    descricao: "Terceira fase de brotação, consolidação do crescimento vegetativo"
  },
  {
    nome: "Pre-Flor",
    diasInicio: 29,
    diasFim: 35,
    cor: "#FFD700",
    descricao: "Preparação para floração, formação dos botões florais"
  },
  {
    nome: "Florada",
    diasInicio: 36,
    diasFim: 42,
    cor: "#FF69B4",
    descricao: "Período de floração plena, abertura das flores"
  },
  {
    nome: "Chumbinho",
    diasInicio: 43,
    diasFim: 49,
    cor: "#8A2BE2",
    descricao: "Formação dos frutos jovens, início do desenvolvimento dos cachos"
  },
  {
    nome: "Raleio 1",
    diasInicio: 50,
    diasFim: 56,
    cor: "#DC143C",
    descricao: "Primeiro raleio dos cachos, seleção dos melhores frutos"
  },
  {
    nome: "Raleio 2",
    diasInicio: 57,
    diasFim: 63,
    cor: "#B22222",
    descricao: "Segundo raleio dos cachos, refinamento da seleção"
  },
  {
    nome: "Pós Raleio 1",
    diasInicio: 64,
    diasFim: 70,
    cor: "#4169E1",
    descricao: "Período após primeiro raleio, desenvolvimento dos frutos selecionados"
  },
  {
    nome: "Pós Raleio 2",
    diasInicio: 71,
    diasFim: 77,
    cor: "#1E90FF",
    descricao: "Período após segundo raleio, crescimento acelerado dos frutos"
  },
  {
    nome: "Pós Raleio 3",
    diasInicio: 78,
    diasFim: 84,
    cor: "#00BFFF",
    descricao: "Fase final pós-raleio, consolidação do tamanho dos frutos"
  },
  {
    nome: "Pré Amolecimento",
    diasInicio: 85,
    diasFim: 91,
    cor: "#FF8C00",
    descricao: "Preparação para o amolecimento, início das mudanças na textura"
  },
  {
    nome: "Amolecimento 1",
    diasInicio: 92,
    diasFim: 98,
    cor: "#FF6347",
    descricao: "Primeira fase do amolecimento, mudanças na consistência dos frutos"
  },
  {
    nome: "Amolecimento 2",
    diasInicio: 99,
    diasFim: 105,
    cor: "#CD5C5C",
    descricao: "Segunda fase do amolecimento, textura adequada para colheita"
  },
  {
    nome: "Maturação",
    diasInicio: 106,
    diasFim: 111,
    cor: "#800080",
    descricao: "Maturação completa dos frutos, desenvolvimento do sabor e aroma"
  },
  {
    nome: "Colheita",
    diasInicio: 112,
    diasFim: Infinity,
    cor: "#4B0082",
    descricao: "Período ideal para colheita, frutos no ponto perfeito"
  }
];