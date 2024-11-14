/*
  Warnings:

  - A unique constraint covering the columns `[funcionario_id,mesReferencia]` on the table `folhas_pagamento` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "folhas_pagamento_funcionario_id_mesReferencia_key" ON "folhas_pagamento"("funcionario_id", "mesReferencia");
