import { Pallets, Prisma } from '@prisma/client'
import { prisma } from '@/prisma'
import { FetchPallets, QrcodePalletRepository } from '../pallet-repository'

export class PrismaQrcodePalletRepository implements QrcodePalletRepository {
  async deletePallet(palletId: string): Promise<Pallets> {
    const pallet = await prisma.pallets.delete({
      where: {
        id: palletId,
      },
    })

    return pallet
  }

  async incrementPalletCaixa(palletId: string): Promise<Pallets> {
    const pallet = await prisma.pallets.update({
      where: {
        id: palletId,
      },
      data: {
        qtdFeitas: {
          increment: 1,
        },
      },
    })

    return pallet
  }

  async vincularCaixaAoPallet(
    palletId: string,
    caixaId: string,
  ): Promise<Pallets> {
    const pallet = await prisma.pallets.update({
      where: {
        id: palletId,
      },
      data: {
        Qrcodes: {
          connect: {
            id: caixaId,
          },
        },
      },
    })

    return pallet
  }

  async findPalletQrcodeById(qrcodeId: string): Promise<Pallets | null> {
    const pallet = await prisma.pallets.findUnique({
      where: {
        id: qrcodeId,
      },
    })

    return pallet
  }

  async fetchAllPalletQrcode(
    page: number,
    perPage: number,
    initialDate: string,
    endDate: string,
    classificacaoId?: number,
    variedadeId?: number,
  ): Promise<FetchPallets> {
    const endDateOfTheDay = new Date(endDate)
    endDateOfTheDay.setUTCHours(23, 59, 59, 999)

    const totalPallets = await prisma.pallets.findMany({
      where: {
        variedadeId,
        caixaId: classificacaoId,
        createdAt: {
          gte: new Date(initialDate),
          lte: new Date(endDateOfTheDay),
        },
      },
      include: {
        Caixa: {
          select: {
            nome: true,
          },
        },
        Variedade: {
          select: {
            nome: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    const pallets = await prisma.pallets.findMany({
      where: {
        variedadeId,
        caixaId: classificacaoId,
        createdAt: {
          gte: new Date(initialDate),
          lte: new Date(endDateOfTheDay),
        },
      },
      include: {
        Caixa: {
          select: {
            nome: true,
          },
        },
        Variedade: {
          select: {
            nome: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: (page - 1) * perPage,
      take: perPage,
    })

    return { pallets, totalPallets: totalPallets.length }
  }

  async changeQrcodePalletUsado(qrcodeId: string): Promise<Pallets | null> {
    const pallet = await prisma.pallets.update({
      where: {
        id: qrcodeId,
      },
      data: {
        usado: true,
      },
    })

    return pallet
  }

  async createQrcodePallet(data: Prisma.PalletsCreateInput): Promise<Pallets> {
    const pallet = await prisma.pallets.create({
      data,
    })

    return pallet
  }
}
