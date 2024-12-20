import { ApontamentoRepository } from '@/repository/apontamento-repository'
import { ResouceNotFoundError } from './errors/resource-not-found'
import { FuncionarioRepository } from '@/repository/funcionario-repository'
import { DuracaoInvalida } from './errors/duracao-invalida'

interface ConcluirApontamentoUseCaseParams {
  apontamentoId: string
  fazenda_id: string
  dataConclusao: string
  qtdAtividade: number
  valorBonus: number
}

export class ConcluirApontamentoUseCase {
  constructor(
    private apontamentoRepository: ApontamentoRepository,
    private funcionarioRepository: FuncionarioRepository,
  ) {}

  async execute({
    apontamentoId,
    fazenda_id,
    dataConclusao,
    qtdAtividade,
    valorBonus,
  }: ConcluirApontamentoUseCaseParams) {
    const apontamento = await this.apontamentoRepository.findById(apontamentoId)

    if (!apontamento) {
      throw new ResouceNotFoundError()
    }

    const funcionario = await this.funcionarioRepository.findFuncionarioById(
      apontamento.funcionario_id,
      fazenda_id,
    )

    if (!funcionario) {
      throw new ResouceNotFoundError()
    }

    // Cálculo da duração do apontamento
    const inicioAtividade = new Date(apontamento.data_inicio)
    const fimAtividade = new Date(dataConclusao)
    const duracaoHoras =
      (fimAtividade.getTime() - inicioAtividade.getTime()) / (1000 * 60 * 60)

    if (duracaoHoras <= 0) {
      throw new DuracaoInvalida()
    }

    const jornadaTrabalho = 8
    const valorDiaria =
      funcionario.tipo_contratacao.toUpperCase() === 'FICHADO' ? 65.95 : 65
    let custoTarefa = 0

    const tipoApontamento = apontamento.tipo_apontamento

    // Verificar se já existe um apontamento no mesmo dia
    const hasApontamentoOnSameDate =
      await this.apontamentoRepository.findOnSameDateById(
        funcionario.id,
        inicioAtividade,
      )

    console.log(hasApontamentoOnSameDate)
    if (tipoApontamento === 'horas') {
      console.log('tipo apontamento horas')
      let duracaoTrabalho = duracaoHoras
      if (duracaoHoras > 5) {
        duracaoTrabalho -= 1
      }
      custoTarefa = (duracaoTrabalho / jornadaTrabalho) * valorDiaria
    } else if (tipoApontamento === 'meta') {
      console.log('tipo apontamento meta')

      if (hasApontamentoOnSameDate?.data_fim) {
        console.log('tem apontamento')

        // Segunda atividade no mesmo dia: calcular proporcional ao restante das horas
        if (hasApontamentoOnSameDate.tipo_apontamento === 'horas') {
          console.log('tem apontamento - horas')

          const duracaoAcumulada = hasApontamentoOnSameDate.duracao_horas ?? 0
          const horasRestantes = Math.max(jornadaTrabalho - duracaoAcumulada, 0)
          custoTarefa = (horasRestantes / jornadaTrabalho) * valorDiaria
        } else {
          console.log('tem apontamento - meta')

          custoTarefa = 0
        }
      } else {
        // Primeira atividade no dia: ganha a diária completa
        custoTarefa = valorDiaria
      }
    }

    // Calcular bônus por excedente
    const excedente = qtdAtividade - (apontamento.meta ?? 0)
    if (excedente > 0) {
      custoTarefa += excedente * valorBonus
    }

    const custoExtra = excedente > 0 ? excedente : 0

    await this.apontamentoRepository.concluirApontamento(
      apontamentoId,
      fazenda_id,
      dataConclusao,
      qtdAtividade,
      custoTarefa,
      duracaoHoras,
      custoExtra,
    )
  }
}
