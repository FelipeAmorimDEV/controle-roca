-- AlterTable
ALTER TABLE "colheitas" ADD COLUMN     "precoVendaId" TEXT;

-- CreateTable
CREATE TABLE "precos_venda" (
    "id" TEXT NOT NULL,
    "classificacao" TEXT NOT NULL,
    "preco" DECIMAL(65,30) NOT NULL,
    "dataInicio" TIMESTAMP(3) NOT NULL,
    "dataFim" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "precos_venda_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "colheitas" ADD CONSTRAINT "colheitas_precoVendaId_fkey" FOREIGN KEY ("precoVendaId") REFERENCES "precos_venda"("id") ON DELETE SET NULL ON UPDATE CASCADE;
