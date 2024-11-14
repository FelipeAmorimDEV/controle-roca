-- CreateTable
CREATE TABLE "folhas_pagamento" (
    "id" TEXT NOT NULL,
    "mesReferencia" TIMESTAMP(3) NOT NULL,
    "funcionario_id" TEXT NOT NULL,
    "totalDiasTrabalhados" INTEGER NOT NULL DEFAULT 0,
    "totalHorasTrabalhadas" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "custo_total" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "folhas_pagamento_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "folhas_pagamento" ADD CONSTRAINT "folhas_pagamento_funcionario_id_fkey" FOREIGN KEY ("funcionario_id") REFERENCES "funcionarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
