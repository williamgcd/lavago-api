CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID NOT NULL DEFAULT gen_random_uuid (),

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ NULL,
    updated_at TIMESTAMPTZ NULL,

    status VARCHAR(20) NOT NULL DEFAULT 'draft',

    is_same_day BOOLEAN NOT NULL DEFAULT FALSE,
    is_one_time BOOLEAN NOT NULL DEFAULT FALSE,

    -- Dates and times

    timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    timestamps JSONB NOT NULL DEFAULT '{}',

    -- Rescheduling information

    reschedules_id UUID REFERENCES public.bookings(id),

    -- Client information

    user_id UUID NOT NULL REFERENCES public.users(id),

    user_name VARCHAR(255),
    user_phone VARCHAR(255),
    user_email VARCHAR(255),
    user_document VARCHAR(255),

    -- Washer information

    washer_id UUID REFERENCES public.washers(user_id),

    washer_name VARCHAR(255),
    washer_phone VARCHAR(255),
    washer_email VARCHAR(255),
    washer_document VARCHAR(255),

    -- Address information

    address_id UUID REFERENCES public.addresses(id),
    property_id UUID REFERENCES public.properties(id),

    address_line_1 VARCHAR(255),
    address_line_2 VARCHAR(255),
    address_lat DECIMAL(10, 8),
    address_lng DECIMAL(11, 8),
    address_zip VARCHAR(255),

    address_notes VARCHAR(255),

    -- Vehicle information

    vehicle_id UUID REFERENCES public.vehicles(id),

    vehicle_name VARCHAR(255),
    vehicle_size VARCHAR(255),
    vehicle_notes VARCHAR(255),

    -- Coupon information

    coupon_id UUID REFERENCES public.coupons(id),

    coupon_code VARCHAR(20) NOT NULL DEFAULT '',
    coupon_discount INTEGER NOT NULL DEFAULT 0,

    -- Payment information

    -- This will be a reference to offering, payment and subscription eventually
    -- offering_id UUID REFERENCES public.offerings(id),
    -- payment_id UUID REFERENCES public.payments(id),
    -- subscription_id UUID REFERENCES public.subscriptions(id),

    -- Pricing information
    -- Prices are always in cents (100 = R$1.00)

    price INTEGER NOT NULL DEFAULT 0,
    price_discount INTEGER NOT NULL DEFAULT 0,
    price_final INTEGER NOT NULL DEFAULT 0,

    quota_washer INTEGER NOT NULL DEFAULT 0,

    -- Notes

    notes TEXT,

    -- Checklists for washer validation
    checklist_ini JSONB DEFAULT '{}',
    checklist_end JSONB DEFAULT '{}',

    CONSTRAINT bookings_pk PRIMARY KEY (id),
    CONSTRAINT bookings_fk_user_id FOREIGN KEY (user_id) REFERENCES users (id),
    CONSTRAINT bookings_fk_washer_id FOREIGN KEY (washer_id) REFERENCES washers (id),
    CONSTRAINT bookings_fk_address_id FOREIGN KEY (address_id) REFERENCES addresses (id),
    CONSTRAINT bookings_fk_property_id FOREIGN KEY (property_id) REFERENCES properties (id),
    CONSTRAINT bookings_fk_vehicle_id FOREIGN KEY (vehicle_id) REFERENCES vehicles (id),
    CONSTRAINT bookings_fk_coupon_id FOREIGN KEY (coupon_id) REFERENCES coupons (id)
) TABLESPACE pg_default;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_timestamp ON public.bookings(timestamp);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_washer_id ON public.bookings(washer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_coupon_id ON public.bookings(coupon_id);
