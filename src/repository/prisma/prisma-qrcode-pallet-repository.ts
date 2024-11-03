import { Pallets, Prisma } from '@prisma/client'
import { prisma } from '@/prisma'
import { FetchPallets, QrcodePalletRepository } from '../pallet-repository'

export class PrismaQrcodePalletRepository implements QrcodePalletRepository {
  async finalizarPallet(palletId: string, fazendaId: string): Promise<Pallets> {
    const pallet = await prisma.pallets.update({
      where: {
        id: palletId,
        fazenda_id: fazendaId,
      },
      data: {
        finalizado: true,
      },
    })

    return pallet
  }

  async deletePallet(palletId: string, fazendaId: string): Promise<Pallets> {
    const pallet = await prisma.pallets.delete({
      where: {
        id: palletId,
        fazenda_id: fazendaId,
      },
    })

    return pallet
  }

  async incrementPalletCaixa(
    palletId: string,
    fazendaId: string,
  ): Promise<Pallets> {
    const pallet = await prisma.pallets.update({
      where: {
        id: palletId,
        fazenda_id: fazendaId,
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
    fazendaId: string,
  ): Promise<Pallets> {
    const pallet = await prisma.pallets.update({
      where: {
        id: palletId,
        fazenda_id: fazendaId,
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

  async findPalletQrcodeById(
    qrcodeId: string,
    fazendaId: string,
  ): Promise<Pallets | null> {
    const pallet = await prisma.pallets.findUnique({
      where: {
        id: qrcodeId,
        fazenda_id: fazendaId,
      },
      include: {
        Caixa: {
          select: {
            nome: true,
          },
        },
      },
    })

    return pallet
  }

  async fetchAllPalletQrcode(
    page: number,
    perPage: number,
    initialDate: string,
    endDate: string,
    fazendaId: string,
    status?: string,
    classificacaoId?: number,
    variedadeId?: number,
  ): Promise<FetchPallets> {
    const endDateOfTheDay = new Date(endDate)
    endDateOfTheDay.setUTCHours(23, 59, 59, 999)

    const totalPallets = await prisma.pallets.findMany({
      where: {
        variedadeId,
        fazenda_id: fazendaId,
        caixaId: classificacaoId,
        finalizado: status === 'true',
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
        setor: {
          select: {
            setorName: true,
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
        finalizado: status === 'true',
        createdAt: {
          gte: new Date(initialDate),
          lte: new Date(endDateOfTheDay),
        },
      },
      include: {
        setor: {
          select: {
            setorName: true,
          },
        },
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

  async changeQrcodePalletUsado(
    qrcodeId: string,
    fazendaId: string,
  ): Promise<Pallets | null> {
    const pallet = await prisma.pallets.update({
      where: {
        id: qrcodeId,
        fazenda_id: fazendaId,
      },
      data: {
        usado: true,
      },
    })

    return pallet
  }

  async createQrcodePallet(
    data: Prisma.PalletsUncheckedCreateInput,
  ): Promise<Pallets> {
    const pallet = await prisma.pallets.create({
      data,
    })

    return pallet
  }
}
