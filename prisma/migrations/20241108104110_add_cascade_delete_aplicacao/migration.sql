-- DropForeignKey
ALTER TABLE "saidas" DROP CONSTRAINT "saidas_aplicacaoId_fkey";

-- AddForeignKey
ALTER TABLE "saidas" ADD CONSTRAINT "saidas_aplicacaoId_fkey" FOREIGN KEY ("aplicacaoId") REFERENCES "aplicacoes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
