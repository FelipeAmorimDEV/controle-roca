-- CreateTable
CREATE TABLE "colheitas" (
    "id" TEXT NOT NULL,
    "pesoCaixa" INTEGER NOT NULL,
    "pesoTotal" INTEGER NOT NULL,
    "qntCaixa" INTEGER NOT NULL,
    "tipoCaixa" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "setorId" TEXT,

    CONSTRAINT "colheitas_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "colheitas" ADD CONSTRAINT "colheitas_setorId_fkey" FOREIGN KEY ("setorId") REFERENCES "setores"("id") ON DELETE SET NULL ON UPDATE CASCADE;
