CREATE TYPE vehicle_size AS ENUM (
    'xs',   -- XS -> Extra small vehicles like motorcycles, scooters, and bicycles
    'sm',   -- SM -> Small vehicles like cars, trucks, and vans
    'md',   -- MD -> Medium vehicles like SUVs, minivans, and pickup trucks
    'lg',   -- LG -> Large vehicles like trucks, buses, and trailers
    'xl',   -- XL -> Extra large vehicles like semi-trailers and tankers
);

CREATE TABLE IF NOT EXISTS public.vehicles (
    id UUID DEFAULT gen_random_uuid(),

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ NULL,
    updated_at TIMESTAMPTZ NULL,

    -- User this vehicle belongs to
    user_id UUID,

    size vehicle_size NOT NULL,
    type VARCHAR(20) NOT NULL,

    year VARCHAR(20) NULL,

    brand VARCHAR(20),
    color VARCHAR(20),
    model VARCHAR(20),
    plate VARCHAR(20),

    notes TEXT NOT NULL DEFAULT '',

    CONSTRAINT vehicles_pk PRIMARY KEY (id),
    CONSTRAINT vehicles_fk_users_id FOREIGN KEY (users_id) REFERENCES public.users(id)
) TABLESPACE pg_default;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_vehicles_vehicle_id ON public.vehicles(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_type ON public.vehicles(type);
