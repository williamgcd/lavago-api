CREATE TABLE IF NOT EXISTS public.chat_messsages (
    id UUID DEFAULT gen_random_uuid(),

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ NULL,
    updated_at TIMESTAMPTZ NULL,

    -- Either references a user or 'system'
    created_by VARCHAR(255) NOT NULL DEFAULT 'system',

    chat_id UUID NOT NULL REFERENCES chats(id),

    type VARCHAR(40) NOT NULL,
    text TEXT NOT NULL,

    CONSTRAINT chat_messages_pk PRIMARY KEY (id),
    CONSTRAINT chat_messages_fk_chat_id FOREIGN KEY (chat_id) REFERENCES chats (id)
) TABLESPACE pg_default;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_chat_messsages_created_by ON public.chat_messsages(created_by);
CREATE INDEX IF NOT EXISTS idx_chat_messsages_chat_ids ON public.chat_messsages(chat_id);
CREATE INDEX IF NOT EXISTS idx_chat_messsages_type ON public.chat_messsages(type);
