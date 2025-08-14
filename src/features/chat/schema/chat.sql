CREATE TYPE offerings_type AS ENUM (
    'closed',
    'open',
    'pending'
);

CREATE TABLE IF NOT EXISTS public.chats (
    id UUID DEFAULT gen_random_uuid(),

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ NULL,
    updated_at TIMESTAMPTZ NULL,

    status chat_status NOT NULL DEFAULT 'pending',

    user_ids UUID[] NOT NULL,

    entity VARCHAR(40) NOT NULL,
    entity_id UUID NOT NULL,
    entity_meta JSONB NOT NULL DEFAULT '{}',

    label VARCHAR(255),
    descr VARCHAR(255),

    CONSTRAINT chats_pk PRIMARY KEY (id)
) TABLESPACE pg_default;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_chats_status ON public.chats(status);
CREATE INDEX IF NOT EXISTS idx_chats_user_ids ON public.chats(user_ids);
CREATE INDEX IF NOT EXISTS idx_chats_entity_entity_id ON public.chats(entity, entity_id);
