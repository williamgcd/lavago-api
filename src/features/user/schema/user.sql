CREATE TYPE user_document_type AS ENUM (
    'cnpj',
    'cpf'
);
CREATE TYPE user_role AS ENUM (
    'admin',
    'client',
    'super',
    'washer'
);

CREATE TABLE IF NOT EXISTS public.users (
    id UUID NOT NULL DEFAULT gen_random_uuid(),

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ NULL,
    updated_at TIMESTAMPTZ NULL,

    role user_role NOT NULL DEFAULT 'client',
    name VARCHAR(255) NULL,

    document VARCHAR(100) NULL,
    document_type user_document_type NULL DEFAULT 'cpf',

    email VARCHAT(255) NULL,
    email_otp VARCHAR(6) NULL,
    email_otp_checked_at TIMESTAMPTZ NULL,
    email_otp_expires_at TIMESTAMPTZ NULL,

    phone VARCHAR(40) NULL,
    phone_otp VARCHAR(6) NULL,
    phone_otp_checked_at TIMESTAMPTZ NULL,
    phone_otp_expires_at TIMESTAMPTZ NULL,

    -- Identity for the user to be reffered by.
    referral VARCHAR(20) NULL,

    CONSTRAINT users_pk PRIMARY KEY (id),
    CONSTRAINT users_unique_email UNIQUE (email),
    CONSTRAINT users_unique_phone UNIQUE (phone),
    CONSTRAINT users_unique_referral UNIQUE (referral)
) TABLESPACE pg_default;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON public.users(phone);
CREATE INDEX IF NOT EXISTS idx_users_referral ON public.users(referral);
