CREATE TYPE offerings_mode AS ENUM (
    'facility',
    'hybrid',
    'mobile'
);
CREATE TYPE offerings_type AS ENUM (
    'optional',
    'product',
    'service'
);

CREATE TABLE IF NOT EXISTS public.offerings (
    id UUID DEFAULT gen_random_uuid(),

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ NULL,
    updated_at TIMESTAMPTZ NULL,

    -- Status
    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    -- Basic Offering identification info
    num VARCHAR(50) NOT NULL AUTO_INCREMENT,
    sku VARCHAR(50) NOT NULL,

    -- Classification options
    mode offerings_mode NOT NULL DEFAULT 'mobile',
    type offerings_type NOT NULL DEFAULT 'service',

    -- Name and Description
    label VARCHAR(255) NOT NULL,
    descr TEXT,

    -- Pricing information
    price INTEGER NOT NULL DEFAULT 0,
    currency VARCHAR(3) NOT NULL DEFAULT 'BRL',

    -- Washer payment information
    -- Quota is what the washer gets from other washes
    -- Share is what they get for their wash.
    default_washer_quota INTEGER DEFAULT 0,
    default_washer_share INTEGER DEFAULT 0,

    duration INTEGER DEFAULT 60,
    optionals JSONB DEFAULT '{}',
    constraints JSONB DEFAULT '{}',

    -- Vehicle restrictions
    vehicle_sizes UUID[], -- Array of vehicle sizes, NULL = general use
    vehicle_types UUID[], -- Array of vehicle types, NULL = general use

    -- Checklists for washer validation
    checklist_ini JSONB DEFAULT '{}',
    checklist_end JSONB DEFAULT '{}',

    CONSTRAINT offerings_pk PRIMARY KEY (id),
    CONSTRAINT offerings_unique_num UNIQUE (num),
    CONSTRAINT offerings_unique_sku UNIQUE (sku)
) TABLESPACE pg_default;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_offerings_is_active ON public.offerings(is_active);
CREATE INDEX IF NOT EXISTS idx_offerings_num ON public.offerings(num);
CREATE INDEX IF NOT EXISTS idx_offerings_sku ON public.offerings(sku);
