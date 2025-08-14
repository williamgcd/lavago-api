CREATE TYPE referral_status AS ENUM (
    'cancelled',
    'completed',
    'failed',
    'pending'
);

CREATE TABLE IF NOT EXISTS public.referrals (
    id UUID DEFAULT gen_random_uuid(),

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ NULL,
    updated_at TIMESTAMPTZ NULL,

    status referral_status NOT NULL DEFAULT 'pending',

    referrer_user_id UUID NOT NULL,
    referred_user_id UUID NOT NULL,

    referral VARCHAR(20) NULL,

    label VARCHAR(255) NOT NULL,
    value INTEGER NOT NULL,

    CONSTRAINT referrals_pk PRIMARY KEY (id),
    CONSTRAINT referrals_fk_referrer_user_id FOREIGN KEY (referrer_user_id) REFERENCES users (id),
    CONSTRAINT referrals_fk_referred_user_id FOREIGN KEY (referred_user_id) REFERENCES users (id),
    CONSTRAINT referrals_unique_referral UNIQUE (referrer_user_id, referred_user_id, referral)
) TABLESPACE pg_default;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_referrals_status ON public.referrals(status);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer_user_id ON public.referrals(referrer_user_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred_user_id ON public.referrals(referred_user_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referral ON public.referrals(referral);
