/*
  Warnings:

  - You are about to drop the column `valor_bonus` on the `atividades` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "apontamentos" ADD COLUMN     "valor_bonus" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "atividades" DROP COLUMN "valor_bonus";
