-- AlterTable
ALTER TABLE "saidas" ADD COLUMN     "fertirrigacaoId" TEXT;

-- AddForeignKey
ALTER TABLE "saidas" ADD CONSTRAINT "saidas_fertirrigacaoId_fkey" FOREIGN KEY ("fertirrigacaoId") REFERENCES "fertirrigacoes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
