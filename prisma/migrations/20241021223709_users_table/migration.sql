/*
  Warnings:

  - You are about to drop the `Aplicacao` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Fornecedor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Setor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tipo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tratorista` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Aplicacao" DROP CONSTRAINT "Aplicacao_setorId_fkey";

-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_fornecedorId_fkey";

-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_tipoId_fkey";

-- DropForeignKey
ALTER TABLE "saidas" DROP CONSTRAINT "saidas_setorId_fkey";

-- DropTable
DROP TABLE "Aplicacao";

-- DropTable
DROP TABLE "Fornecedor";

-- DropTable
DROP TABLE "Setor";

-- DropTable
DROP TABLE "Tipo";

-- DropTable
DROP TABLE "Tratorista";

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "setores" (
    "id" TEXT NOT NULL,
    "setorName" TEXT NOT NULL,
    "variedade" TEXT NOT NULL,
    "filas" TEXT NOT NULL,
    "tamanhoArea" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "setores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "aplicacoes" (
    "id" TEXT NOT NULL,
    "aplicador" TEXT NOT NULL,
    "volumeCalda" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "produtosAplicados" JSONB NOT NULL,
    "setorId" TEXT,

    CONSTRAINT "aplicacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tratoristas" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "tratoristas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fornecedores" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "fornecedores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tipos" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "tipos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_user_key" ON "users"("user");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_fornecedorId_fkey" FOREIGN KEY ("fornecedorId") REFERENCES "fornecedores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_tipoId_fkey" FOREIGN KEY ("tipoId") REFERENCES "tipos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saidas" ADD CONSTRAINT "saidas_setorId_fkey" FOREIGN KEY ("setorId") REFERENCES "setores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aplicacoes" ADD CONSTRAINT "aplicacoes_setorId_fkey" FOREIGN KEY ("setorId") REFERENCES "setores"("id") ON DELETE SET NULL ON UPDATE CASCADE;
