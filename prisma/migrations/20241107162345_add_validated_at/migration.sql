-- DropForeignKey
ALTER TABLE "produtos_notas_fiscais" DROP CONSTRAINT "produtos_notas_fiscais_entradaId_fkey";

-- AlterTable
ALTER TABLE "pallets" ADD COLUMN     "validated_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "qrcodes" ADD COLUMN     "validated_at" TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE "produtos_notas_fiscais" ADD CONSTRAINT "produtos_notas_fiscais_entradaId_fkey" FOREIGN KEY ("entradaId") REFERENCES "entradas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
