/*
  Warnings:

  - Added the required column `entradaId` to the `produtos_notas_fiscais` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "produtos_notas_fiscais" DROP CONSTRAINT "produtos_notas_fiscais_notaFiscalId_fkey";

-- AlterTable
ALTER TABLE "produtos_notas_fiscais" ADD COLUMN     "entradaId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "produtos_notas_fiscais" ADD CONSTRAINT "produtos_notas_fiscais_notaFiscalId_fkey" FOREIGN KEY ("notaFiscalId") REFERENCES "notas_fiscais"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "produtos_notas_fiscais" ADD CONSTRAINT "produtos_notas_fiscais_entradaId_fkey" FOREIGN KEY ("entradaId") REFERENCES "entradas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
