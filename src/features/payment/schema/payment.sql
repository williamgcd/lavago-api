-- Payment statuses
CREATE TYPE payment_status AS ENUM (
    // Draft/Setup Flow
    'draft',        -- Payment created internally
    'pending',      -- Payment created, waiting for user action
    'processing',   -- Payment being processed by provider
    'authorized',   -- Payment authorized but not captured
    'captured',     -- Payment successfully captured

    // Cancellation or Error States
    'failed',       -- Payment failed
    'cancelled',    -- Payment cancelled by user/system
    'refunded',     -- Payment refunded
    'expired'       -- Payment expired
);

-- Payment type
CREATE TYPE payment_method AS ENUM (
    'immediate',    -- Charge immediately using payment method
    'link',         -- Returns a link to the user
    'pre_auth',     -- Pre-authorize funds, capture later
);

-- Payment methods
CREATE TYPE payment_method AS ENUM (
    'credit_card',
    'pix'
);

-- Payment table
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID DEFAULT gen_random_uuid(),

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ NULL,
    updated_at TIMESTAMPTZ NULL,

    -- The user who is doing the payment.
    user_id UUID NOT NULL,

    -- Entity relationship data.
    entity VARCHAR(40) NOT NULL,
    entity_id UUID NOT NULL,
    entity_meta JSONB NOT NULL DEFAULT '{}',

    -- Payment is created internally then provider
    -- Once provider returns with information we update the status
    status payment_status NOT NULL DEFAULT 'pending',

    -- Value information
    amount INTEGER NOT NULL, -- Amount in cents (100 = R$1.00)
    currency VARCHAR(3) NOT NULL DEFAULT 'BRL',

    -- Payment type and method
    type payment_type DEFAULT 'link',
    method payment_method DEFAULT 'pix',

    -- Provider integration
    provider VARCHAR(40) NOT NULL DEFAULT 'pagbank',
    provider_id VARCHAR(255), -- External payment ID from provider
    provider_link VARCHAR(255) NULL, -- Link to execute the payment
    provider_meta JSONB NOT NULL DEFAULT '{}', -- Provider-specific data

    -- Payment flow
    expires_at TIMESTAMPTZ NULL,
    captured_at TIMESTAMPTZ NULL,
    refunded_at TIMESTAMPTZ NULL,

    -- Metadata
    description TEXT NULL,

    CONSTRAINT payments_pk PRIMARY KEY (id),
    CONSTRAINT payments_fk_user_id FOREIGN KEY (user_id) REFERENCES users (id),
    CONSTRAINT payments_fk_booking_id FOREIGN KEY (booking_id) REFERENCES bookings (id),
    CONSTRAINT payments_fk_subscription_id FOREIGN KEY (subscription_id) REFERENCES subscriptions (id),
    CONSTRAINT payments_check_amount CHECK (amount > 0),
    CONSTRAINT payments_check_currency CHECK (currency IN ('BRL', 'USD', 'EUR')),
    CONSTRAINT payments_check_entity CHECK (
        (booking_id IS NOT NULL AND subscription_id IS NULL) OR
        (booking_id IS NULL AND subscription_id IS NOT NULL) OR
        (booking_id IS NULL AND subscription_id IS NULL)
    )
) TABLESPACE pg_default;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_entity_entity_id ON public.payments(entity, entity_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_method ON public.payments(method);
CREATE INDEX IF NOT EXISTS idx_payments_provider_id ON public.payments(provider_id);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON public.payments(created_at);
CREATE INDEX IF NOT EXISTS idx_payments_expires_at ON public.payments(expires_at);
CREATE INDEX IF NOT EXISTS idx_payments_captured_at ON public.payments(captured_at);

-- Create composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_payments_user_status ON public.payments(user_id, status);
CREATE INDEX IF NOT EXISTS idx_payments_booking_status ON public.payments(booking_id, status);
CREATE INDEX IF NOT EXISTS idx_payments_subscription_status ON public.payments(subscription_id, status);
CREATE INDEX IF NOT EXISTS idx_payments_provider_provider_id ON public.payments(provider, provider_id);

-- Add comments for documentation
COMMENT ON TABLE public.payments IS 'Payment records for all transactions in the system';
COMMENT ON COLUMN public.payments.amount IS 'Payment amount in cents (100 = R$1.00)';
COMMENT ON COLUMN public.payments.provider_meta IS 'Provider-specific data like payment links, QR codes, etc.';
COMMENT ON COLUMN public.payments.metadata IS 'Additional payment metadata for business logic';
COMMENT ON COLUMN public.payments.expires_at IS 'When the payment expires (for PIX, Boleto, etc.)';
COMMENT ON COLUMN public.payments.captured_at IS 'When the payment was captured (for authorized payments)';
COMMENT ON COLUMN public.payments.refunded_at IS 'When the payment was refunded';
