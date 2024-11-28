import { ApontamentoRepository } from '@/repository/apontamento-repository'
import { Apontamento } from '@prisma/client'

interface CreateApontamentoUseCaseParams {
  funcionarioId: string
  atividadeId: string
  setorId: string
  fazenda_id: string
  meta: number
  data_inicio: string
  tipoApontamento: string
}

interface CreateApontamentoUseCaseResponse {
  apontamento: Apontamento
}

export class CreateApontamentoUseCase {
  constructor(private apontamentoRepository: ApontamentoRepository) {}

  async execute({
    atividadeId,
    funcionarioId,
    setorId,
    fazenda_id,
    meta,
    data_inicio,
    tipoApontamento,
  }: CreateApontamentoUseCaseParams): Promise<CreateApontamentoUseCaseResponse> {
    const apontamento = await this.apontamentoRepository.createApontamento({
      atividade_id: atividadeId,
      funcionario_id: funcionarioId,
      setor_id: setorId,
      fazenda_id,
      meta,
      data_inicio: new Date(data_inicio),
      tipo_apontamento: tipoApontamento,
    })

    return { apontamento }
  }
}
