-- AlterTable
ALTER TABLE "entradas" ADD COLUMN     "aplicacao_id" TEXT;

-- AddForeignKey
ALTER TABLE "entradas" ADD CONSTRAINT "entradas_aplicacao_id_fkey" FOREIGN KEY ("aplicacao_id") REFERENCES "aplicacoes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
