import { Fazenda, Prisma } from '@prisma/client'
import { prisma } from '@/prisma'
import { FazendaRepository } from '../fazenda-repository'

export class PrismaFazendaRepository implements FazendaRepository {
  async findFazendaById(fazendaId: string): Promise<Fazenda | null> {
    const fazenda = await prisma.fazenda.findUnique({
      where: {
        id: fazendaId,
      },
    })

    return fazenda
  }

  async createFazenda(data: Prisma.FazendaCreateInput): Promise<Fazenda> {
   const fazenda = prisma.fazenda.create({
    data: {
      nome: data.nome,
      Tipo: {
        createMany: {
          data: [
            { name: "Sementes" },
            { name: "Mudas" },
            { name: "Fertilizantes Granulados" },
            { name: "Fertilizantes Líquidos" },
            { name: "Adubos Orgânicos" },
            { name: "Adubos Foliares" },
            { name: "Corretivos de Solo" },
            { name: "Herbicidas" },
            { name: "Fungicidas" },
            { name: "Inseticidas" },
            { name: "Acaricidas" },
            { name: "Nematicidas" },
            { name: "Inoculantes" },
            { name: "Biofertilizantes" },
            { name: "Adjuvantes" },
            { name: "Substratos" },
            { name: "Condicionadores de Solo" },
            { name: "Irrigação/Hidroponia" },
            { name: "Produtos Veterinários" },
            { name: "Outros Insumos Agrícolas" },
          ],
        },
      },
    },
    include: { Tipo: true }, // opcional, retorna junto os tipos criados
  });

    return fazenda
  }
}
