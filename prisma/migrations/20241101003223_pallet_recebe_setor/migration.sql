/*
  Warnings:

  - Added the required column `setor_id` to the `pallets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "pallets" ADD COLUMN     "setor_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "pallets" ADD CONSTRAINT "pallets_setor_id_fkey" FOREIGN KEY ("setor_id") REFERENCES "setores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
