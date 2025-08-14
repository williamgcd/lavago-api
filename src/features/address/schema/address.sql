CREATE TABLE IF NOT EXISTS public.addresses (
    id UUID DEFAULT gen_random_uuid(),

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ NULL,
    updated_at TIMESTAMPTZ NULL,

    property_id UUID NULL REFERENCES properties(id),
    user_id UUID NOT NULL REFERENCES users(id),

    is_default BOOLEAN NOT NULL DEFAULT false,

    type VARCHAR(40) NOT NULL DEFAULT 'unknown',

    label VARCHAR(255),

    street VARCHAR(255),
    number VARCHAR(255),
    complement VARCHAR(255),
    neighborhood VARCHAR(255),
    city VARCHAR(255),
    state VARCHAR(255),
    country VARCHAR(255) DEFAULT 'BR',
    zip_code VARCHAR(255),

    lat DECIMAL(10, 8),
    lng DECIMAL(11, 8),

    notes VARCHAR(255),

    constraints JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT addresses_pk PRIMARY KEY (id),
    CONSTRAINT addresses_fk_property_id FOREIGN KEY (property_id) REFERENCES properties (id),
    CONSTRAINT addresses_fk_user_id FOREIGN KEY (user_id) REFERENCES users (id)
) TABLESPACE pg_default;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_addresses_property_id ON public.addresses(property_id);
CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON public.addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_addresses_is_default ON public.addresses(is_default);
CREATE INDEX IF NOT EXISTS idx_addresses_zip ON public.addresses(zip);
