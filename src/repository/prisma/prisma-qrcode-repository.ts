import { Prisma, Qrcodes } from '@prisma/client'
import { prisma } from '@/prisma'
import { QrcodeRepository } from '../qrcode-repository'

export class PrismaQrcodeRepository implements QrcodeRepository {
  async fetchAllQrcode(
    initialDate: string,
    endDate: string,
    fazendaId: string,
    functionarioId?: string,
  ): Promise<Qrcodes[]> {
    const endDateOfTheDay = new Date(endDate)
    endDateOfTheDay.setUTCHours(23, 59, 59, 999)

    const qrcodes = await prisma.qrcodes.findMany({
      where: {
        fazenda_id: fazendaId,
        funcionarioId: functionarioId,
        createdAt: {
          gte: new Date(initialDate),
          lte: new Date(endDateOfTheDay),
        },
      },
    })

    return qrcodes
  }

  async changeQrcodeUsado(
    qrcodeId: string,
    fazendaId: string,
  ): Promise<Qrcodes | null> {
    const qrcode = await prisma.qrcodes.update({
      where: {
        id: qrcodeId,
        fazenda_id: fazendaId,
      },
      data: {
        usado: true,
      },
    })

    return qrcode
  }

  async findQrcodeById(
    qrcodeId: string,
    fazendaId: string,
  ): Promise<Qrcodes | null> {
    const qrcode = await prisma.qrcodes.findUnique({
      where: {
        id: qrcodeId,
        fazenda_id: fazendaId,
      },
    })

    return qrcode
  }

  async createQrcode(
    data: Prisma.QrcodesUncheckedCreateInput,
  ): Promise<Qrcodes> {
    const qrcode = prisma.qrcodes.create({
      data: {
        Funcionario: {
          connect: {
            id: data.funcionarioId,
          },
        },
        fazenda: {
          connect: {
            id: data.fazenda_id,
          },
        },
      },
    })

    return qrcode
  }
}
