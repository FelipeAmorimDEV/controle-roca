/*
  Warnings:

  - You are about to drop the column `aplicacao_id` on the `entradas` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "entradas" DROP CONSTRAINT "entradas_aplicacao_id_fkey";

-- AlterTable
ALTER TABLE "entradas" DROP COLUMN "aplicacao_id";

-- AlterTable
ALTER TABLE "saidas" ADD COLUMN     "aplicacaoId" TEXT;

-- AddForeignKey
ALTER TABLE "saidas" ADD CONSTRAINT "saidas_aplicacaoId_fkey" FOREIGN KEY ("aplicacaoId") REFERENCES "aplicacoes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
