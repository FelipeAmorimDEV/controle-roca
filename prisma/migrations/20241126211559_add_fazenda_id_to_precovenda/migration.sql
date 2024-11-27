/*
  Warnings:

  - You are about to drop the column `precoVendaId` on the `colheitas` table. All the data in the column will be lost.
  - Added the required column `fazenda_id` to the `precos_venda` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "colheitas" DROP CONSTRAINT "colheitas_precoVendaId_fkey";

-- AlterTable
ALTER TABLE "colheitas" DROP COLUMN "precoVendaId",
ADD COLUMN     "preco_venda_id" TEXT;

-- AlterTable
ALTER TABLE "precos_venda" ADD COLUMN     "fazenda_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "precos_venda" ADD CONSTRAINT "precos_venda_fazenda_id_fkey" FOREIGN KEY ("fazenda_id") REFERENCES "fazendas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "colheitas" ADD CONSTRAINT "colheitas_preco_venda_id_fkey" FOREIGN KEY ("preco_venda_id") REFERENCES "precos_venda"("id") ON DELETE SET NULL ON UPDATE CASCADE;
