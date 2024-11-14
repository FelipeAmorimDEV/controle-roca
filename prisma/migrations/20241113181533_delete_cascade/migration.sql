-- DropForeignKey
ALTER TABLE "ProdutoFertirrigacao" DROP CONSTRAINT "ProdutoFertirrigacao_produto_id_fkey";

-- AddForeignKey
ALTER TABLE "ProdutoFertirrigacao" ADD CONSTRAINT "ProdutoFertirrigacao_produto_id_fkey" FOREIGN KEY ("produto_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
