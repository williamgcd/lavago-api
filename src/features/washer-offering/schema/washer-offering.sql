CREATE TABLE IF NOT EXISTS public.washer_offerings (
    id UUID DEFAULT gen_random_uuid(),

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ NULL,
    updated_at TIMESTAMPTZ NULL,

    offering_id UUID NOT NULL,
    washer_id UUID NOT NULL REFERENCES washers(id),

    is_certified BOOLEAN NOT NULL DEFAULT FALSE,
    is_preferred BOOLEAN NOT NULL DEFAULT FALSE,

    -- Usage information

    usage_count INTEGER NOT NULL DEFAULT 0,
    usage_level INTEGER NOT NULL DEFAULT 0,
    usage_badge VARCHAR(40) NOT NULL DEFAULT 'novice',

    last_used_at TIMESTAMPTZ,
    last_used_on UUID NOT NULL REFERENCES bookings(id),

    -- Rating information
    avg_rating DECIMAL(3,2) NOT NULL DEFAULT 0,

    -- Duration information
    avg_duration INTEGER NOT NULL DEFAULT 0,
    max_duration INTEGER NOT NULL DEFAULT 0,
    min_duration INTEGER NOT NULL DEFAULT 0,

    -- Training information
    -- User goes through some screening process to ensure they are qualified
    -- This process may include background checks, training, and certification

    certified_by UUID NOT NULL REFERENCES washers(id),
    certified_at TIMESTAMPTZ,

    trained_by UUID NOT NULL REFERENCES washers(id),
    trained_at TIMESTAMPTZ,

    -- Washer payment information
    -- Quota is what the washer gets from other washes
    -- Share is what they get for their wash.
    overwrite_washer_quota INTEGER DEFAULT 0,
    overwrite_washer_share INTEGER DEFAULT 0,

    CONSTRAINT washer_offerings_pk PRIMARY KEY (id),
    CONSTRAINT washer_offerings_fk_offering_id FOREIGN KEY (offering_id) REFERENCES offering (id),
    CONSTRAINT washer_offerings_fk_washer_id FOREIGN KEY (washer_id) REFERENCES washers (id),
    CONSTRAINT washer_offerings_fk_certified_by FOREIGN KEY (certified_by) REFERENCES washers (id)
    CONSTRAINT washer_offerings_fk_trained_by FOREIGN KEY (trained_by) REFERENCES washers (id),

    CONSTRAINT washers_unique_offering_id_washer_id UNIQUE (offering_id, washer_id)
) TABLESPACE pg_default;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_washer_offerings_offering_id ON public.washer_offerings(offering_id);
CREATE INDEX IF NOT EXISTS idx_washer_offerings_washer_id ON public.washer_offerings(washer_id);
