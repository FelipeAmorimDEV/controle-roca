-- Fix foreign key constraint names that have typos
-- The original migration created constraints with 'tratarId' instead of 'tratorId'

-- First, check if the old constraint exists and drop it if it does
DO $$ 
BEGIN
    -- Drop the old constraint if it exists
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'alertas_manutencao_tratarId_fkey'
        AND table_name = 'alertas_manutencao'
    ) THEN
        ALTER TABLE "alertas_manutencao" DROP CONSTRAINT "alertas_manutencao_tratarId_fkey";
    END IF;
    
    -- Drop other old constraints if they exist
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'manutencoes_tratarId_fkey'
        AND table_name = 'manutencoes'
    ) THEN
        ALTER TABLE "manutencoes" DROP CONSTRAINT "manutencoes_tratarId_fkey";
    END IF;
    
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'registros_horas_tratarId_fkey'
        AND table_name = 'registros_horas'
    ) THEN
        ALTER TABLE "registros_horas" DROP CONSTRAINT "registros_horas_tratarId_fkey";
    END IF;
END $$;

-- Add the correct foreign key constraints if they don't exist
DO $$
BEGIN
    -- Add constraint for alertas_manutencao if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'alertas_manutencao_tratorId_fkey'
        AND table_name = 'alertas_manutencao'
    ) THEN
        ALTER TABLE "alertas_manutencao" ADD CONSTRAINT "alertas_manutencao_tratorId_fkey" 
        FOREIGN KEY ("tratorId") REFERENCES "tratores"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    
    -- Add constraint for manutencoes if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'manutencoes_tratorId_fkey'
        AND table_name = 'manutencoes'
    ) THEN
        ALTER TABLE "manutencoes" ADD CONSTRAINT "manutencoes_tratorId_fkey" 
        FOREIGN KEY ("tratorId") REFERENCES "tratores"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    
    -- Add constraint for registros_horas if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'registros_horas_tratorId_fkey'
        AND table_name = 'registros_horas'
    ) THEN
        ALTER TABLE "registros_horas" ADD CONSTRAINT "registros_horas_tratorId_fkey" 
        FOREIGN KEY ("tratorId") REFERENCES "tratores"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;
