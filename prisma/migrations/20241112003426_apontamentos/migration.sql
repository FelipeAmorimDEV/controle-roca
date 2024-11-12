-- AlterTable
ALTER TABLE "apontamentos" ADD COLUMN     "custo_tarefa" DOUBLE PRECISION,
ADD COLUMN     "meta" INTEGER;

-- AlterTable
ALTER TABLE "atividades" ADD COLUMN     "valor_bonus" DOUBLE PRECISION DEFAULT 0;

-- AlterTable
ALTER TABLE "funcionarios" ADD COLUMN     "tipo_contratacao" TEXT NOT NULL DEFAULT 'fichado';
