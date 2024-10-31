/*
  Warnings:

  - Added the required column `filas` to the `Setor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tamanhoArea` to the `Setor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `variedade` to the `Setor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Setor" ADD COLUMN     "filas" TEXT NOT NULL,
ADD COLUMN     "tamanhoArea" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "variedade" TEXT NOT NULL;
