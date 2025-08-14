CREATE TYPE schedule_slot_type AS ENUM (
    'custom',
    'default',
    'time_off',
    'unplanned'
)

CREATE TABLE IF NOT EXISTS public.schedule_slots (
    id UUID DEFAULT gen_random_uuid(),

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ NULL,
    updated_at TIMESTAMPTZ NULL,

    -- Either references a user or 'system'
    created_by VARCHAR(255) NOT NULL DEFAULT 'system',

    -- The booking this schedule_slots is associated with
    booking_id UUID,
    -- The washer this schedule_slots belongs to
    washer_id UUID NOT NULL,

    -- Whether or not the schedule_slots is available
    -- It might not be available even if no booking.
    is_available BOOLEAN NOT NULL DEFAULT TRUE,

    -- Whether or nto the schedule_slot was optimized
    is_optimized BOOLEAN NOT NULL DEFAULT FALSE,

    timestamp TIMESTAMPZ NOT NULL,
    duration INTEGER NOT NULL DEFAULT 30,

    -- What offerings does this schedule support?
    -- If not specified, then all the offerings.
    oferring_ids UUID[] NULL,

    -- What type of schedule_slots it is
    type schedule_slots_type NOT NULL DEFAULT 'custom',

    CONSTRAINT schedule_slots_pk PRIMARY KEY (id),
    CONSTRAINT schedule_slots_fk_booking_id FOREIGN KEY (booking_id) REFERENCES bookings (id),
    CONSTRAINT schedule_slots_fk_washer_id FOREIGN KEY (washer_id) REFERENCES washers (id)
) TABLESPACE pg_default;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_schedule_slots_booking_id ON public.schedule_slots(booking_id);
CREATE INDEX IF NOT EXISTS idx_schedule_slots_washer_id ON public.schedule_slots(washer_id);
CREATE INDEX IF NOT EXISTS idx_schedule_slots_type ON public.schedule_slots(type);
CREATE INDEX IF NOT EXISTS idx_schedule_slots_timestamp ON public.schedule_slots(timestamp);
