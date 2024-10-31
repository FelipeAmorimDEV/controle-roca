import { Prisma, Qrcodes } from '@prisma/client'
import { prisma } from '@/prisma'
import { QrcodeRepository } from '../qrcode-repository'

export class PrismaQrcodeRepository implements QrcodeRepository {
  async fetchAllQrcode(functionarioId?: string): Promise<Qrcodes[]> {
    let qrcodes
    if (functionarioId) {
      qrcodes = await prisma.qrcodes.findMany({
        where: {
          funcionarioId: functionarioId,
        },
      })

      return qrcodes
    }

    qrcodes = await prisma.qrcodes.findMany({
      where: {
        funcionarioId: functionarioId,
      },
    })

    return qrcodes
  }

  async changeQrcodeUsado(qrcodeId: string): Promise<Qrcodes | null> {
    const qrcode = await prisma.qrcodes.update({
      where: {
        id: qrcodeId,
      },
      data: {
        usado: true,
      },
    })

    return qrcode
  }

  async findQrcodeById(qrcodeId: string): Promise<Qrcodes | null> {
    const qrcode = await prisma.qrcodes.findUnique({
      where: {
        id: qrcodeId,
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
      },
    })

    return qrcode
  }
}
