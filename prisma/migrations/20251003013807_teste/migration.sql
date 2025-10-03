/*
  Warnings:

  - You are about to drop the column `tratarId` on the `alertas_manutencao` table. All the data in the column will be lost.
  - You are about to drop the column `tratarId` on the `manutencoes` table. All the data in the column will be lost.
  - You are about to drop the column `tratarId` on the `registros_horas` table. All the data in the column will be lost.
  - Added the required column `tratorId` to the `alertas_manutencao` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tratorId` to the `manutencoes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tratorId` to the `registros_horas` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "alertas_manutencao" DROP CONSTRAINT "alertas_manutencao_tratarId_fkey";

-- DropForeignKey
ALTER TABLE "manutencoes" DROP CONSTRAINT "manutencoes_tratarId_fkey";

-- DropForeignKey
ALTER TABLE "registros_horas" DROP CONSTRAINT "registros_horas_tratarId_fkey";

-- AlterTable
ALTER TABLE "alertas_manutencao" DROP COLUMN "tratarId",
ADD COLUMN     "tratorId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "manutencoes" DROP COLUMN "tratarId",
ADD COLUMN     "tratorId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "registros_horas" DROP COLUMN "tratarId",
ADD COLUMN     "tratorId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "registros_horas" ADD CONSTRAINT "registros_horas_tratorId_fkey" FOREIGN KEY ("tratorId") REFERENCES "tratores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alertas_manutencao" ADD CONSTRAINT "alertas_manutencao_tratorId_fkey" FOREIGN KEY ("tratorId") REFERENCES "tratores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "manutencoes" ADD CONSTRAINT "manutencoes_tratorId_fkey" FOREIGN KEY ("tratorId") REFERENCES "tratores"("id") ON DELETE CASCADE ON UPDATE CASCADE;
