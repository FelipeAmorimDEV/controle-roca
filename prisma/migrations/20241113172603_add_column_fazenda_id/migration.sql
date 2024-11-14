/*
  Warnings:

  - Added the required column `fazenda_id` to the `fertirrigacoes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "fertirrigacoes" ADD COLUMN     "fazenda_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "fertirrigacoes" ADD CONSTRAINT "fertirrigacoes_fazenda_id_fkey" FOREIGN KEY ("fazenda_id") REFERENCES "fazendas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
