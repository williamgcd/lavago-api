CREATE TYPE subscription_booking_frequency AS ENUM (
    'every_day',
    'every_week',
    'every_2_weeks',
    'every_month',
    'every_2_months',
);
CREATE TYPE subscription_payment_frequency AS ENUM (
    -- Means pre-auth/capture payment method.
    -- Frequency in days would be 1 so it pre-auths 24hrs before the booking
    'every_booking',

    'every_day',
    'every_week',
    'every_2_weeks',
    'every_month',
    'every_2_months',
);
CREATE TYPE subscription_status AS ENUM (
    'active',
    'cancelled',
    'expired',
    'paused'
);

CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID DEFAULT gen_random_uuid(),

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ NULL,
    updated_at TIMESTAMPTZ NULL,

    -- Plan the user is subscribed to
    plan_id UUID NOT NULL,
    -- User who is subscribed
    user_id UUID NOT NULL,

    -- Controls if the subscription is active
    -- status like cancelled, expired, paused means inactive.
    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    -- Controls if the subscription is automated
    -- This means the bookings will be created automatically.
    is_automated BOOLEAN NOT NULL DEFAULT FALSE,

    status subscription_status NOT NULL DEFAULT 'active',

    -- How much we discount the user for the subscription
    -- The pricing depends on the offering and the vehicle they choose.
    discount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,

    -- How often the user booking will be created
    booking_frequency subscription_booking_frequency NOT NULL DEFAULT 'every_month',
    booking_frequency_in_days INTEGER NOT NULL DEFAULT 30,

    last_booking_date TIMESTAMPTZ NULL,
    next_booking_date TIMESTAMPTZ NULL,

    -- Bookings on the payment period
    -- `limit` is the maximum number of bookings allowed in the payment period.
    -- `count` is the current cycle.
    -- `total` is the total number of bookings ever.
    booking_limit INTEGER NULL,
    booking_count INTEGER NOT NULL DEFAULT 0,
    booking_total INTEGER NOT NULL DEFAULT 0,

    -- When will we change the user for their subscription
    payment_frequency subscription_payment_frequency NOT NULL DEFAULT 'every_month',
    payment_frequency_in_days INTEGER NOT NULL DEFAULT 30,

    last_payment_date TIMESTAMPTZ NULL,
    next_payment_date TIMESTAMPTZ NULL,

    -- Payment provider information
    -- Used to interact with the payment provider
    payment_provider VARCHAR(40) DEFAULT 'pagbank',
    payment_provider_id VARCHAR(255),
    payment_provider_meta JSONB NULL,

    CONSTRAINT subscriptions_pk PRIMARY KEY (id),
    CONSTRAINT subscriptions_fk_plan_id FOREIGN KEY (plan_id) REFERENCES plans (id),
    CONSTRAINT subscriptions_fk_user_id FOREIGN KEY (user_id) REFERENCES users (id)
) TABLESPACE pg_default;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_plan_id ON public.subscriptions(plan_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_is_active ON public.subscriptions(is_active);
CREATE INDEX IF NOT EXISTS idx_subscriptions_next_booking_date ON public.subscriptions(next_booking_date);
CREATE INDEX IF NOT EXISTS idx_subscriptions_next_payment_date ON public.subscriptions(next_payment_date);
