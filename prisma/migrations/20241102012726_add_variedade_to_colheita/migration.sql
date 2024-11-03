/*
  Warnings:

  - You are about to drop the column `variedade` on the `setores` table. All the data in the column will be lost.
  - Added the required column `variedade` to the `colheitas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `variedade_id` to the `setores` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "colheitas" ADD COLUMN     "variedade" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "setores" DROP COLUMN "variedade",
ADD COLUMN     "variedade_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "setores" ADD CONSTRAINT "setores_variedade_id_fkey" FOREIGN KEY ("variedade_id") REFERENCES "variedades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
