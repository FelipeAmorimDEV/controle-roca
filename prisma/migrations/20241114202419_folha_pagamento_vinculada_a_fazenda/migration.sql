/*
  Warnings:

  - Added the required column `fazenda_id` to the `folhas_pagamento` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "folhas_pagamento" ADD COLUMN     "fazenda_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "folhas_pagamento" ADD CONSTRAINT "folhas_pagamento_fazenda_id_fkey" FOREIGN KEY ("fazenda_id") REFERENCES "fazendas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
