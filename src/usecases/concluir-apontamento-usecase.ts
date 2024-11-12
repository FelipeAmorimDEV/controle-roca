import { ApontamentoRepository } from '@/repository/apontamento-repository'
import { ResouceNotFoundError } from './errors/resource-not-found'
import { FuncionarioRepository } from '@/repository/funcionario-repository'
import { AtividadeRepository } from '@/repository/atividade-repository'

interface ConcluirApontamentoUseCaseParams {
  apontamentoId: string
  fazenda_id: string
  dataConclusao: string
  qtdAtividade: number
}

export class ConcluirApontamentoUseCase {
  constructor(
    private apontamentoRepository: ApontamentoRepository,
    private funcionarioRepository: FuncionarioRepository,
    private atividadeRepository: AtividadeRepository,
  ) {}

  async execute({
    apontamentoId,
    fazenda_id,
    dataConclusao,
    qtdAtividade,
  }: ConcluirApontamentoUseCaseParams) {
    const apontamento = await this.apontamentoRepository.findById(apontamentoId)

    if (!apontamento) {
      throw new ResouceNotFoundError()
    }

    const atividade = await this.atividadeRepository.findById(
      apontamento.atividade_id,
    )

    if (!atividade) {
      throw new ResouceNotFoundError()
    }

    const funcionario = await this.funcionarioRepository.findFuncionarioById(
      apontamento.funcionario_id,
      fazenda_id,
    )

    if (!funcionario) {
      throw new ResouceNotFoundError()
    }

    const valorDiaria =
      funcionario.tipo_contratacao.toUpperCase() === 'FICHADO' ? 44 : 50

    // Verificar se a quantidade realizada excede a meta
    let custoTarefa = valorDiaria
    const excedente = qtdAtividade - (apontamento.meta ?? 0)
    const valorBonus = atividade.valor_bonus || 1 // Bônus por atividade excedente, padrão 1 real por unidade

    if (excedente > 0) {
      custoTarefa += excedente * valorBonus
    }

    await this.apontamentoRepository.concluirApontamento(
      apontamentoId,
      fazenda_id,
      dataConclusao,
      qtdAtividade,
      custoTarefa,
    )
  }
}
