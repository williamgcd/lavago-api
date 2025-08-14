 CREATE TABLE IF NOT EXISTS public.properties (
    id UUID NOT NULL DEFAULT gen_random_uuid(),

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ NULL,
    updated_at TIMESTAMPTZ NULL,

    is_supported BOOLEAN NOT NULL DEFAULT FALSE,

    label VARCHAR(255) NOT NULL,
    descr TEXT,

    street VARCHAR(255) NOT NULL,
    number VARCHAR(20) NOT NULL,
    complement VARCHAR(255),
    neighborhood VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    state VARCHAR(255) NOT NULL,
    country VARCHAR(2) NOT NULL DEFAULT 'BR',
    zip_code VARCHAR(8) NOT NULL,

    lat DECIMAL(10, 8),
    lng DECIMAL(11, 8),

    default_hours JSONB,
    default_notes VARCHAR(255),

    constraints JSONB NOT NULL DEFAULT '{}',

    price_cashback DECIMAL(10, 2) NOT NULL DEFAULT 0.0,
    price_multiple DECIMAL(10, 2) NOT NULL DEFAULT 1.0,

    CONSTRAINT properties_pk PRIMARY KEY (id)
) TABLESPACE pg_default;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_properties_is_supported ON public.properties(is_supported);
CREATE INDEX IF NOT EXISTS idx_properties_city ON public.properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_zip_code ON public.properties(zip_code);
