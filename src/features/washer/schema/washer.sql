CREATE TABLE IF NOT EXISTS public.washers (
    -- ID should be the same as user_id
    id UUID,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ NULL,
    updated_at TIMESTAMPTZ NULL,

    -- Washer is always associated to a user
    user_id UUID REFERENCES users(id),

    -- Rating information

    avg_rating NUMERIC(3,2) NOT NULL DEFAULT 0,
    avg_rating_count INTEGER NOT NULL DEFAULT 0,

    -- Geocoding/Geofencing information

    last_lat NUMERIC(10,6) NOT NULL DEFAULT 0,
    last_lng NUMERIC(10,6) NOT NULL DEFAULT 0,
    last_seen_at TIMESTAMPTZ NOT NULL,

    default_hours JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT washers_pk PRIMARY KEY (user_id),
    CONSTRAINT washers_unique_user_id UNIQUE (user_id)
) TABLESPACE pg_default;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_washers_user_id ON public.washers(user_id);
