/*
  Warnings:

  - Added the required column `priceSaida` to the `saidas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "saidas" ADD COLUMN     "priceSaida" DOUBLE PRECISION NOT NULL;
