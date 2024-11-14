-- CreateTable
CREATE TABLE "fertirrigacoes" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finalized_at" TIMESTAMP(3),
    "aplicador_id" TEXT NOT NULL,
    "setor_id" TEXT NOT NULL,

    CONSTRAINT "fertirrigacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProdutoFertirrigacao" (
    "id" TEXT NOT NULL,
    "produto_id" TEXT NOT NULL,
    "quantidade" DOUBLE PRECISION NOT NULL,
    "fertirrigacaoId" TEXT,

    CONSTRAINT "ProdutoFertirrigacao_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "fertirrigacoes" ADD CONSTRAINT "fertirrigacoes_aplicador_id_fkey" FOREIGN KEY ("aplicador_id") REFERENCES "funcionarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fertirrigacoes" ADD CONSTRAINT "fertirrigacoes_setor_id_fkey" FOREIGN KEY ("setor_id") REFERENCES "setores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProdutoFertirrigacao" ADD CONSTRAINT "ProdutoFertirrigacao_produto_id_fkey" FOREIGN KEY ("produto_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProdutoFertirrigacao" ADD CONSTRAINT "ProdutoFertirrigacao_fertirrigacaoId_fkey" FOREIGN KEY ("fertirrigacaoId") REFERENCES "fertirrigacoes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
