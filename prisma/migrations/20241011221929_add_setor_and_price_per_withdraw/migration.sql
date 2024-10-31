-- AlterTable
ALTER TABLE "saidas" ADD COLUMN     "setorId" TEXT;

-- CreateTable
CREATE TABLE "Setor" (
    "id" TEXT NOT NULL,
    "setorName" TEXT NOT NULL,

    CONSTRAINT "Setor_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "saidas" ADD CONSTRAINT "saidas_setorId_fkey" FOREIGN KEY ("setorId") REFERENCES "Setor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
