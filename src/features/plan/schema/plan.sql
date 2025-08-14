-- ENUM Sharing
-- Both booking and payment enums are created on the subscriptions file
-- @see: src/features/_schemas/subscription.sql

CREATE TABLE IF NOT EXISTS public.plans (
    id UUID DEFAULT gen_random_uuid(),

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ NULL,
    updated_at TIMESTAMPTZ NULL,

    -- Controls if the plan is active
    -- All users on the plan will be paused
    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    -- Controls if users have access to this plans
    is_available BOOLEAN NOT NULL DEFAULT TRUE,

    -- UNIQUE code to identify the plan
    code VARCHAR(40) NOT NULL,

    label VARCHAR(255) NOT NULL,
    descr TEXT,

    -- How much we discount the user for the subscription
    -- The pricing depends on the offering and the vehicle they choose.
    discount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,

    -- Frequency for the user for booking and payment.
    -- We can create a booking every week, charge every 6 months.
    booking_frequency subscription_booking_frequency NOT NULL DEFAULT 'every_month',
    payment_frequency subscription_payment_frequency NOT NULL DEFAULT 'every_month',

    -- Limit of bookings on the payment period
    -- Null means unlimited bookings
    booking_limit INTEGER NULL,

    CONSTRAINT plans_pk PRIMARY KEY (id),
    CONSTRAINT plans_unique_code UNIQUE (code)
) TABLESPACE pg_default;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_plans_code ON public.plans(code);
CREATE INDEX IF NOT EXISTS idx_plans_is_active ON public.plans(is_active);
CREATE INDEX IF NOT EXISTS idx_plans_is_available ON public.plans(is_available);
CREATE INDEX IF NOT EXISTS idx_plans_payment_frequency ON public.plans(payment_frequency);
CREATE INDEX IF NOT EXISTS idx_plans_booking_frequency ON public.plans(booking_frequency);
