import { FolhaPagamentoRepository } from '@/repository/folha-pagamento-repository'
import { FuncionarioRepository } from '@/repository/funcionario-repository'
import { FolhaPagamento } from '@prisma/client'

interface CreateFolhaPagamentoUseCaseParams {
  fazenda_id: string
  mesReferencia: Date
}

interface CreateFolhaPagamentoUseCaseResponse {
  folhaPagamento: FolhaPagamento[]
}

export class CreateFolhaPagamentoUseCase {
  constructor(
    private folhaPagamentoRepository: FolhaPagamentoRepository,
    private funcionariosRepository: FuncionarioRepository,
  ) {}

  async execute({
    fazenda_id,
    mesReferencia,
  }: CreateFolhaPagamentoUseCaseParams): Promise<CreateFolhaPagamentoUseCaseResponse> {
    const funcionarios =
      await this.funcionariosRepository.fetchAllFuncionarios(fazenda_id)

    const folhaPagamento = []

    for (const funcionario of funcionarios) {
      let totalHorasTrabalhadas = 0
      let totalDiasTrabalhados = 0
      let custoTotal = 0

      for (const apontamento of funcionario.Apontamento) {
        console.log(apontamento)
        console.log(mesReferencia.getMonth())
        console.log(apontamento.data_inicio.getMonth())
        if (
          apontamento.data_inicio.getMonth() === mesReferencia.getMonth() &&
          apontamento.data_inicio.getFullYear() === mesReferencia.getFullYear()
        ) {
          const horasTrabalhadas =
            (new Date(apontamento.data_fim!).getTime() -
              new Date(apontamento.data_inicio).getTime()) /
            3600000
          totalHorasTrabalhadas += horasTrabalhadas
          totalDiasTrabalhados += 1
          custoTotal += apontamento.custo_tarefa ?? 0
        }
      }

      const folha = await this.folhaPagamentoRepository.createOrUpdate({
        funcionario_id: funcionario.id,
        mesReferencia,
        custo_total: custoTotal,
        totalDiasTrabalhados,
        totalHorasTrabalhadas,
        fazenda_id,
      })

      folhaPagamento.push(folha)
    }

    return { folhaPagamento }
  }
}

/* 
- [x] Obter a lista com todos funcionarios e seus apontamentos
- [x] Percorrer cada funcionario
- [x] Percorrer todos os apontamentos de cada funcionario 
- [x] Verificar se o apontamento e do mes e ano em questão
- [x] Se for acrecenta o dia trabalhando em 1, e o valor do pagamento sera a soma do custo dos apontamentos e horas trabalhadas
- [x] Gera a folha de pagamento para cada funcionario
- [x] Retorna a folha de pagamento de todos funcionarios
*/
