/*
  Warnings:

  - You are about to drop the column `tipoCaixa` on the `colheitas` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "colheitas" DROP COLUMN "tipoCaixa",
ADD COLUMN     "caixa_id" INTEGER NOT NULL DEFAULT 1;

-- AddForeignKey
ALTER TABLE "colheitas" ADD CONSTRAINT "colheitas_caixa_id_fkey" FOREIGN KEY ("caixa_id") REFERENCES "caixas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
