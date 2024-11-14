/*
  Warnings:

  - Added the required column `semana` to the `fertirrigacoes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "fertirrigacoes" ADD COLUMN     "semana" TEXT NOT NULL;
