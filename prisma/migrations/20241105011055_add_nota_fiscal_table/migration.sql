-- CreateTable
CREATE TABLE "notas_fiscais" (
    "id" TEXT NOT NULL,
    "dataNota" TIMESTAMP(3) NOT NULL,
    "dataPagamento" TIMESTAMP(3),
    "statusPagamento" TEXT NOT NULL DEFAULT 'pendente',
    "fazenda_id" TEXT NOT NULL,

    CONSTRAINT "notas_fiscais_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "produtos_notas_fiscais" (
    "id" TEXT NOT NULL,
    "quantidade" DOUBLE PRECISION NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "notaFiscalId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "produtos_notas_fiscais_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "notas_fiscais" ADD CONSTRAINT "notas_fiscais_fazenda_id_fkey" FOREIGN KEY ("fazenda_id") REFERENCES "fazendas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "produtos_notas_fiscais" ADD CONSTRAINT "produtos_notas_fiscais_notaFiscalId_fkey" FOREIGN KEY ("notaFiscalId") REFERENCES "notas_fiscais"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "produtos_notas_fiscais" ADD CONSTRAINT "produtos_notas_fiscais_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
