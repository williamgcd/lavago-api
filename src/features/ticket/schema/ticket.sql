CREATE TYPE ticket_status AS ENUM (
    'cancelled',
    'closed',
    'open',
    'pending'
);

CREATE TABLE IF NOT EXISTS public.tickets (
    id UUID DEFAULT gen_random_uuid(),

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ NULL,
    updated_at TIMESTAMPTZ NULL,

    -- The user who created the ticket
    user_id UUID NOT NULL,

    -- Assignement information (attendent)
    assigned_at TIMESTAMPTZ NULL,
    assigned_to UUID NULL,

    -- Entity this ticket is related to
    entity VARCHAR(40) NOT NULL,
    entity_id UUID NOT NULL,
    entity_meta JSONB NOT NULL DEFAULT '{}',

    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    type VARCHAR(20) NOT NULL DEFAULT 'support',

    label VARCHAR(255) NOT NULL,
    descr TEXT,

    CONSTRAINT tickets_pk PRIMARY KEY (id),
    CONSTRAINT tickets_fk_user_id FOREIGN KEY (user_id) REFERENCES users (id),
    CONSTRAINT tickets_fk_assigned_to FOREIGN KEY (assigned_to) REFERENCES users (id)
) TABLESPACE pg_default;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_tickets_user_id ON public.tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_tickets_assigned_to ON public.tickets(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tickets_entity_entity_id ON public.tickets(entity, entity_id);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON public.tickets(status);
