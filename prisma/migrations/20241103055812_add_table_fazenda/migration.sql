/*
  Warnings:

  - Added the required column `fazenda_id` to the `aplicacoes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fazenda_id` to the `apontamentos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fazenda_id` to the `atividades` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fazenda_id` to the `caixas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fazenda_id` to the `colheitas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fazenda_id` to the `entradas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fazenda_id` to the `fornecedores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fazenda_id` to the `funcionarios` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fazenda_id` to the `pallets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fazenda_id` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fazenda_id` to the `qrcodes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fazenda_id` to the `saidas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fazenda_id` to the `setores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fazenda_id` to the `tipos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fazenda_id` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fazenda_id` to the `variedades` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "aplicacoes" ADD COLUMN     "fazenda_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "apontamentos" ADD COLUMN     "fazenda_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "atividades" ADD COLUMN     "fazenda_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "caixas" ADD COLUMN     "fazenda_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "colheitas" ADD COLUMN     "fazenda_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "entradas" ADD COLUMN     "fazenda_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "fornecedores" ADD COLUMN     "fazenda_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "funcionarios" ADD COLUMN     "fazenda_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "pallets" ADD COLUMN     "fazenda_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "fazenda_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "qrcodes" ADD COLUMN     "fazenda_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "saidas" ADD COLUMN     "fazenda_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "setores" ADD COLUMN     "fazenda_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "tipos" ADD COLUMN     "fazenda_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "fazenda_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "variedades" ADD COLUMN     "fazenda_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "fazendas" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "fazendas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "fazendas_nome_key" ON "fazendas"("nome");

-- AddForeignKey
ALTER TABLE "qrcodes" ADD CONSTRAINT "qrcodes_fazenda_id_fkey" FOREIGN KEY ("fazenda_id") REFERENCES "fazendas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pallets" ADD CONSTRAINT "pallets_fazenda_id_fkey" FOREIGN KEY ("fazenda_id") REFERENCES "fazendas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "variedades" ADD CONSTRAINT "variedades_fazenda_id_fkey" FOREIGN KEY ("fazenda_id") REFERENCES "fazendas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "caixas" ADD CONSTRAINT "caixas_fazenda_id_fkey" FOREIGN KEY ("fazenda_id") REFERENCES "fazendas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_fazenda_id_fkey" FOREIGN KEY ("fazenda_id") REFERENCES "fazendas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_fazenda_id_fkey" FOREIGN KEY ("fazenda_id") REFERENCES "fazendas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saidas" ADD CONSTRAINT "saidas_fazenda_id_fkey" FOREIGN KEY ("fazenda_id") REFERENCES "fazendas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entradas" ADD CONSTRAINT "entradas_fazenda_id_fkey" FOREIGN KEY ("fazenda_id") REFERENCES "fazendas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "setores" ADD CONSTRAINT "setores_fazenda_id_fkey" FOREIGN KEY ("fazenda_id") REFERENCES "fazendas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aplicacoes" ADD CONSTRAINT "aplicacoes_fazenda_id_fkey" FOREIGN KEY ("fazenda_id") REFERENCES "fazendas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fornecedores" ADD CONSTRAINT "fornecedores_fazenda_id_fkey" FOREIGN KEY ("fazenda_id") REFERENCES "fazendas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tipos" ADD CONSTRAINT "tipos_fazenda_id_fkey" FOREIGN KEY ("fazenda_id") REFERENCES "fazendas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "colheitas" ADD CONSTRAINT "colheitas_fazenda_id_fkey" FOREIGN KEY ("fazenda_id") REFERENCES "fazendas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "funcionarios" ADD CONSTRAINT "funcionarios_fazenda_id_fkey" FOREIGN KEY ("fazenda_id") REFERENCES "fazendas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "atividades" ADD CONSTRAINT "atividades_fazenda_id_fkey" FOREIGN KEY ("fazenda_id") REFERENCES "fazendas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "apontamentos" ADD CONSTRAINT "apontamentos_fazenda_id_fkey" FOREIGN KEY ("fazenda_id") REFERENCES "fazendas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
