/*
  Warnings:

  - You are about to drop the column `setorId` on the `apontamentos` table. All the data in the column will be lost.
  - Added the required column `setor_id` to the `apontamentos` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "apontamentos" DROP CONSTRAINT "apontamentos_setorId_fkey";

-- AlterTable
ALTER TABLE "apontamentos" DROP COLUMN "setorId",
ADD COLUMN     "setor_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "apontamentos" ADD CONSTRAINT "apontamentos_setor_id_fkey" FOREIGN KEY ("setor_id") REFERENCES "setores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
