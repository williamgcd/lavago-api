CREATE TABLE IF NOT EXISTS public.cache (
    id UUID NOT NULL DEFAULT gen_random_uuid (),

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ,

    -- Expiration date
    expires_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP + INTERVAL '1 day',

     -- Entity that is being cached
    entity VARCHAR(40) NOT NULL,
    entity_key VARCHAR(255) NOT NULL,
    entity_val JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT cache_pk PRIMARY KEY (id)
) TABLESPACE pg_default;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_tickets_entity_entity_key ON public.tickets(entity, entity_key);
