CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID DEFAULT gen_random_uuid(),

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ NULL,
    updated_at TIMESTAMPTZ NULL,

    -- Status
    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    -- Basic info
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,

    -- Discount details
    discount_type VARCHAR(20) NOT NULL, -- 'percentage' or 'fixed'
    discount_value INTEGER NOT NULL, -- percentage (0-100) or in cents amount

    -- Usage limits
    usage_limit INTEGER, -- NULL = unlimited
    usage_count INTEGER NOT NULL DEFAULT 0,

    -- User restrictions
    allowed_users UUID[], -- Array of user IDs, NULL = general use
    blocked_users UUID[], -- Array of user IDs, NULL = general use

    -- Validity
    valid_from TIMESTAMPTZ,
    valid_until TIMESTAMPTZ,

    CONSTRAINT coupons_pk PRIMARY KEY (id),
    CONSTRAINT coupons_unique_code UNIQUE (code)
) TABLESPACE pg_default;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_coupons_code ON public.coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupons_is_active ON public.coupons(is_active);
