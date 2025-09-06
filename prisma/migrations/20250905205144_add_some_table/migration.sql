-- CreateEnum
CREATE TYPE "StatusTrator" AS ENUM ('ATIVO', 'MANUTENCAO', 'INATIVO');

-- CreateEnum
CREATE TYPE "TipoManutencao" AS ENUM ('TROCA_OLEO', 'FILTROS', 'PREVENTIVA', 'CORRETIVA', 'OUTROS');

-- CreateEnum
CREATE TYPE "StatusManutencao" AS ENUM ('AGENDADA', 'EM_ANDAMENTO', 'CONCLUIDA', 'CANCELADA');

-- CreateTable
CREATE TABLE "tratores" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "marca" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "ano" INTEGER NOT NULL,
    "numeroSerie" TEXT NOT NULL,
    "horasAtuais" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "dataCompra" TIMESTAMP(3) NOT NULL,
    "status" "StatusTrator" NOT NULL DEFAULT 'ATIVO',
    "fazenda_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tratores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "registros_horas" (
    "id" TEXT NOT NULL,
    "tratarId" TEXT NOT NULL,
    "horasAnteriores" DOUBLE PRECISION NOT NULL,
    "horasNovas" DOUBLE PRECISION NOT NULL,
    "descricao" TEXT,
    "operador" TEXT NOT NULL,
    "dataTrabalho" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fazenda_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "registros_horas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alertas_manutencao" (
    "id" TEXT NOT NULL,
    "tratarId" TEXT NOT NULL,
    "tipo" "TipoManutencao" NOT NULL,
    "intervaloHoras" DOUBLE PRECISION NOT NULL,
    "proximaManutencaoHoras" DOUBLE PRECISION NOT NULL,
    "descricao" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "fazenda_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "alertas_manutencao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "manutencoes" (
    "id" TEXT NOT NULL,
    "tratarId" TEXT NOT NULL,
    "tipo" "TipoManutencao" NOT NULL,
    "descricao" TEXT NOT NULL,
    "horasRealizacao" DOUBLE PRECISION NOT NULL,
    "dataManutencao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "custo" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "mecanico" TEXT NOT NULL,
    "status" "StatusManutencao" NOT NULL DEFAULT 'CONCLUIDA',
    "observacoes" TEXT,
    "fazenda_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "manutencoes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tratores_numeroSerie_key" ON "tratores"("numeroSerie");

-- AddForeignKey
ALTER TABLE "registros_horas" ADD CONSTRAINT "registros_horas_tratarId_fkey" FOREIGN KEY ("tratarId") REFERENCES "tratores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alertas_manutencao" ADD CONSTRAINT "alertas_manutencao_tratarId_fkey" FOREIGN KEY ("tratarId") REFERENCES "tratores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "manutencoes" ADD CONSTRAINT "manutencoes_tratarId_fkey" FOREIGN KEY ("tratarId") REFERENCES "tratores"("id") ON DELETE CASCADE ON UPDATE CASCADE;
