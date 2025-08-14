CREATE TYPE transaction_operation AS ENUM (
    'credit',
    'debit'
);
CREATE TYPE transaction_status AS ENUM (
    'cancelled',
    'completed',
    'failed',
    'pending'
);

CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID DEFAULT gen_random_uuid(),

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ NULL,
    updated_at TIMESTAMPTZ NULL,

    -- Either references a user or 'system'
    created_by VARCHAR(255) NOT NULL DEFAULT 'system',

    -- The user who the transaction affects
    user_id UUID,

    -- Entity this transaction is related to
    entity VARCHAR(40) NOT NULL,
    entity_id UUID NOT NULL,
    entity_meta JSONB NOT NULL DEFAULT '{}',

    status transaction_status NOT NULL DEFAULT 'pending',

    label VARCHAR(255),
    value INTEGER NOT NULL DEFAULT 0,
    currency VARCHAR(3) NOT NULL DEFAULT 'BRL',
    operation transaction_operation NOT NULL,

    CONSTRAINT transactions_pk PRIMARY KEY (id),
    CONSTRAINT transactions_fk_user_id FOREIGN KEY (user_id) REFERENCES users (id)
) TABLESPACE pg_default;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_entity_entity_id ON public.transactions(entity, entity_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON public.transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_operation ON public.transactions(operation);
