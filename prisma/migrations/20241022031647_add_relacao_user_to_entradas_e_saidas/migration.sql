/*
  Warnings:

  - Added the required column `usersId` to the `entradas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usersId` to the `saidas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "entradas" ADD COLUMN     "usersId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "saidas" ADD COLUMN     "usersId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "saidas" ADD CONSTRAINT "saidas_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entradas" ADD CONSTRAINT "entradas_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
