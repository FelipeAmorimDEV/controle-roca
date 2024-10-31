/*
  Warnings:

  - Added the required column `cargo` to the `funcionarios` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "funcionarios" ADD COLUMN     "cargo" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "atividades" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,

    CONSTRAINT "atividades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "apontamentos" (
    "id" TEXT NOT NULL,
    "data_inicio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_fim" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'em andamento',
    "funcionario_id" TEXT NOT NULL,
    "atividade_id" TEXT NOT NULL,
    "setorId" TEXT,

    CONSTRAINT "apontamentos_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "apontamentos" ADD CONSTRAINT "apontamentos_funcionario_id_fkey" FOREIGN KEY ("funcionario_id") REFERENCES "funcionarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "apontamentos" ADD CONSTRAINT "apontamentos_atividade_id_fkey" FOREIGN KEY ("atividade_id") REFERENCES "atividades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "apontamentos" ADD CONSTRAINT "apontamentos_setorId_fkey" FOREIGN KEY ("setorId") REFERENCES "setores"("id") ON DELETE SET NULL ON UPDATE CASCADE;
