-- DropForeignKey
ALTER TABLE "ProdutoFertirrigacao" DROP CONSTRAINT "ProdutoFertirrigacao_fertirrigacaoId_fkey";

-- AddForeignKey
ALTER TABLE "ProdutoFertirrigacao" ADD CONSTRAINT "ProdutoFertirrigacao_fertirrigacaoId_fkey" FOREIGN KEY ("fertirrigacaoId") REFERENCES "fertirrigacoes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
