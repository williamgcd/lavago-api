CREATE TYPE audit_creator_role AS ENUM (
    'admin',
    'client',
    'system',
    'super',
    'washer'
);

CREATE TABLE IF NOT EXISTS public.audits (
    id UUID NOT NULL,

    -- Audit metadata
    timestamp TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Creator metadata
    -- Either references a user or 'system'
    creator_user VARCHAR(255) NOT NULL DEFAULT 'system',
    creator_role audit_creator_role NOT NULL DEFAULT 'system',

    -- Entity metadata
    entity VARCHAR(255) NOT NULL,
    entity_id UUID NOT NULL,
    entity_meta JSONB NOT NULL DEFAULT '{}',

    -- Action metadata
    action VARCHAR(255) NOT NULL,
    message VARCHAR(255) NULL,

    -- Request metadata
    request_id UUID NULL,
    request_ip VARCHAR(255) NULL,
    request_ua VARCHAR(255) NULL,

    CONSTRAINT audits_pk PRIMARY KEY (id)
) TABLESPACE pg_default;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_audits_timestamp ON public.audits (timestamp);
CREATE INDEX IF NOT EXISTS idx_audits_creator_user ON public.audits (creator_user);
CREATE INDEX IF NOT EXISTS idx_audits_entity ON public.audits (entity);
CREATE INDEX IF NOT EXISTS idx_audits_entity_id ON public.audits (entity_id);
CREATE INDEX IF NOT EXISTS idx_audits_request_id ON public.audits (request_id);
