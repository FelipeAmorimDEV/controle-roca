-- CreateTable
CREATE TABLE "Aplicacao" (
    "id" TEXT NOT NULL,
    "aplicador" TEXT NOT NULL,
    "volumeCalda" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "produtosAplicados" JSONB NOT NULL,
    "setorId" TEXT,

    CONSTRAINT "Aplicacao_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Aplicacao" ADD CONSTRAINT "Aplicacao_setorId_fkey" FOREIGN KEY ("setorId") REFERENCES "Setor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
