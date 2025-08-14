-- ENUM Sharing
-- Both rating_metric and rating_pattern are created on the ratings file
-- @see: src/features/_schemas/rating.sql

CREATE TABLE IF NOT EXISTS public.questions (
    id UUID DEFAULT gen_random_uuid(),

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ,

    -- Entity this rate is about
    entity VARCHAR(40) NULL,

    label VARCHAR(255) NOT NULL,
    descr TEXT NULL,

    metric rating_metric NOT NULL,
    pattern rating_pattern NOT NULL,
    scale VARCHAR(20) NOT NULL,

    questions JSONB NOT NULL

    CONSTRAINT questions_pk PRIMARY KEY (id)
) TABLESPACE pg_default;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_questions_metric ON public.questions(metric);
CREATE INDEX IF NOT EXISTS idx_questions_pattern ON public.questions(pattern);
