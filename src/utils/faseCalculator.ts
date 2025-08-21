import { FASES_PLANTAS } from '../constants/fases';
import type { FasePlanta } from '@/@types/phases'; 

export function calcularDiasAposPoda(dataPoda: Date): number {
  const hoje = new Date();
  const diffTime = Math.abs(hoje.getTime() - dataPoda.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export function obterFaseAtual(diasAposPoda: number): FasePlanta | null {
  return FASES_PLANTAS.find(fase => 
    diasAposPoda >= fase.diasInicio && diasAposPoda <= fase.diasFim
  ) || null;
}

export function calcularFaseSetor(dataPoda: Date | null): {
  faseAtual: FasePlanta | null;
  diasAposPoda: number;
} {
  if (!dataPoda) {
    return {
      faseAtual: null,
      diasAposPoda: 0
    };
  }

  const diasAposPoda = calcularDiasAposPoda(dataPoda);
  const faseAtual = obterFaseAtual(diasAposPoda);

  return {
    faseAtual,
    diasAposPoda
  };
}