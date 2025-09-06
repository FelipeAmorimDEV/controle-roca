// services/notification-service.ts
import nodemailer from 'nodemailer'

export class NotificationService {
  private transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST, // smtp.gmail.com
    port: Number(process.env.SMTP_PORT), // 587
    secure: false, // ⚠️ precisa ser false no 587, true só se usar 465
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    },
    tls: {
      rejectUnauthorized: false // às vezes necessário no dev
    }
  })

  async enviarAlertaManutencao(trator: any, alertas: any[]) {
    const alertasTexto = alertas.map(alerta =>
      `- ${alerta.descricao} (${alerta.horasAtraso}h em atraso)`
    ).join('\n')

    const emailOptions = {
      from: process.env.EMAIL_FROM,
      to: process.env.MANAGER_EMAIL,
      subject: `🔧 Alerta de Manutenção - ${trator.nome}`,
      html: `
        <h2>⚠️ Alerta de Manutenção</h2>
        <p><strong>Trator:</strong> ${trator.nome}</p>
        <p><strong>Horas Atuais:</strong> ${trator.horasAtuais}h</p>
        <p><strong>Manutenções Pendentes:</strong></p>
        <pre>${alertasTexto}</pre>
      `
    }

    await this.transporter.sendMail(emailOptions)
  }
}