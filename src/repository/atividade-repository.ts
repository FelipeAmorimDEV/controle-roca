import { Atividade, Prisma } from '@prisma/client'

export interface AtividadeRepository {
  createAtividade(
    data: Prisma.AtividadeUncheckedCreateInput,
  ): Promise<Atividade>
  fetchAtividade(fazendaId: string): Promise<Atividade[]>
}
