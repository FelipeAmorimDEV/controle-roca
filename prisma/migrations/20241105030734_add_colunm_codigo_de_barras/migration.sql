/*
  Warnings:

  - Added the required column `fornecedor_id` to the `notas_fiscais` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "notas_fiscais" ADD COLUMN     "codigo_de_barras" TEXT,
ADD COLUMN     "fornecedor_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "notas_fiscais" ADD CONSTRAINT "notas_fiscais_fornecedor_id_fkey" FOREIGN KEY ("fornecedor_id") REFERENCES "fornecedores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
