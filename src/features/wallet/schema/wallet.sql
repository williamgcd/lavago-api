CREATE TABLE IF NOT EXISTS public.wallets (
    -- ID should be the same as user_id
    id UUID,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ NULL,
    updated_at TIMESTAMPTZ NULL,

    -- User this wallet belongs to
    user_id UUID REFERENCES users(id),

    -- Balance in cents
    balance INTEGER NOT NULL DEFAULT 0,
    currency VARCHAR(3) NOT NULL DEFAULT 'BRL',

    CONSTRAINT wallets_pk PRIMARY KEY (id),
    CONSTRAINT wallets_fk_user_id FOREIGN KEY (user_id) REFERENCES users (id)
    CONSTRAINT wallets_unique_user_id UNIQUE (user_id)
) TABLESPACE pg_default;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_wallets_user_id ON public.wallets(user_id);
