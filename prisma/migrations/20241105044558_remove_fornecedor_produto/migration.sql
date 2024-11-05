-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_fornecedorId_fkey";

-- AlterTable
ALTER TABLE "products" ALTER COLUMN "fornecedorId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_fornecedorId_fkey" FOREIGN KEY ("fornecedorId") REFERENCES "fornecedores"("id") ON DELETE SET NULL ON UPDATE CASCADE;
