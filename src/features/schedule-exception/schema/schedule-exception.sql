-- ENUM Sharing
-- The schedule_type is created on the schedules file
-- @see: src/features/_schemas/schedule_slot.sql

CREATE TABLE IF NOT EXISTS public.schedule_exceptions (
    id UUID DEFAULT gen_random_uuid(),

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ NULL,
    updated_at TIMESTAMPTZ NULL,

    -- Either references a user or 'system'
    created_by VARCHAR(255) NOT NULL DEFAULT 'system',

    -- If the schedule exception is for washers
    -- If empty, the exception will be applied for everyone.
    washer_ids UUID[] NOT NULL,

    -- Whether exception to available or not
    is_available BOOLEAN NOT NULL DEFAULT TRUE,

    -- What type of schedule it is
    type schedule_type NOT NULL DEFAULT 'custom',

    interval_ini TIMESTAMPZ NOT NULL,
    interval_end TIMESTAMPZ NOT NULL,

    reason VARCHAR(255) NOT NULL,
    comment TEXT,

    CONSTRAINT schedule_exceptions_pk PRIMARY KEY (id),
    CONSTRAINT schedule_exceptions_fk_booking_id FOREIGN KEY (booking_id) REFERENCES bookings (id),
    CONSTRAINT schedule_exceptions_fk_washer_id FOREIGN KEY (washer_id) REFERENCES washers (id)
) TABLESPACE pg_default;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_schedule_exceptions_booking_id ON public.schedule_exceptions(booking_id);
CREATE INDEX IF NOT EXISTS idx_schedule_exceptions_washer_id ON public.schedule_exceptions(washer_id);
CREATE INDEX IF NOT EXISTS idx_schedule_exceptions_timestamp ON public.schedule_exceptions(timestamp);
CREATE INDEX IF NOT EXISTS idx_schedule_exceptions_type ON public.schedule_exceptions(type);
