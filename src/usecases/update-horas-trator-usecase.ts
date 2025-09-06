import { TratorRepository } from '@/repository/trator-repository'
import { NotificationService } from '@/services/notification-service'

interface UpdateHorasTratorUseCaseParams {
  tratarId: string
  horasNovas: number
  descricao?: string
  operador: string
  fazenda_id: string
}

export class UpdateHorasTratorUseCase {
  constructor(private tratorRepository: TratorRepository, private notificationService: NotificationService) {}

  async execute(params: UpdateHorasTratorUseCaseParams): Promise<void> {
    const trator = await this.tratorRepository.findById(params.tratarId, params.fazenda_id)
    
    if (trator) {
      const alertasPendentes = trator.alertasManutencao
        .filter(alerta => params.horasNovas >= alerta.proximaManutencaoHoras)
        .map(alerta => ({
          tipo: alerta.tipo,
          descricao: alerta.descricao,
          horasAtraso: trator.horasAtuais - alerta.proximaManutencaoHoras
        }))

        console.log("ALERTAS PENDENTES", alertasPendentes)

      // 📧 ENVIA EMAIL SE HOUVER ALERTAS
      if (alertasPendentes.length > 0) {
        await this.notificationService.enviarAlertaManutencao({...trator, horasAtuais: params.horasNovas}, alertasPendentes)
      }


    await this.tratorRepository.updateHoras(params)


    
    }
  }
}