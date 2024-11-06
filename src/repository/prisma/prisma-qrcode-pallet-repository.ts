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

  async findPalletQrcodeById(qrcodeId: string): Promise<Pallets | null> {
    const pallet = await prisma.pallets.findUnique({
      where: {
        id: qrcodeId,
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
        finalizado: status ? status === 'aberto' : undefined,
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
        fazenda_id: fazendaId,
        caixaId: classificacaoId,
        finalizado: status ? status === 'finalizado' : undefined,
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

    const totalColhido = totalPallets.reduce((acc, item) => {
      const qtdFeitas = item.qtdFeitas ?? 0
      const peso = item.peso ?? 0

      return acc + qtdFeitas * (peso / 1000)
    }, 0)

    return { pallets, totalPallets: totalPallets.length, totalColhido }
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

  async createQrcodePallet(
    data: Prisma.PalletsUncheckedCreateInput,
  ): Promise<Pallets> {
    const pallet = await prisma.pallets.create({
      data,
    })

    return pallet
  }
}
