CREATE TYPE rating_metric AS ENUM (
    'attitude',    -- Courtesy or Behavior
    'care',        -- Attention to detail
    'experience',  -- Overall experience
    'feeling',     -- Emotional response
    'nps',         -- Willingness to recommend
    'overall'      -- Overall rating
    'price',       -- Price fairness
    'punctuality', -- On-time performance
    'quality',     -- Service quality
    'support',     -- Customer support
    'usability',   -- App usability
);

CREATE TYPE rating_pattern AS ENUM (
    'ces',   -- Customer Effort Score
    'csat',  -- Customer Satisfaction Score
    'emoji', -- Emotional Reaction
    'nps',   -- Net Promoter Score
    'stars', -- Star Rating
    'rating' -- Numeric Rating
);

CREATE TABLE IF NOT EXISTS public.ratings (
    id UUID DEFAULT gen_random_uuid(),

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ NULL,
    updated_at TIMESTAMPTZ NULL,

    user_id UUID NOT NULL,

    -- Entity this rating is about
    entity VARCHAR(40) NOT NULL,
    entity_id UUID NOT NULL,
    entity_meta JSONB NOT NULL DEFAULT '{}',

    label VARCHAR(255) NOT NULL,
    descr TEXT NULL,

    metric rating_metric NOT NULL,
    pattern rating_pattern NOT NULL,

    scale VARCHAR(20) NOT NULL,
    value VARCHAR(20) NOT NULL,

    comment TEXT NULL,

    CONSTRAINT ratings_pk PRIMARY KEY (id),
    CONSTRAINT ratings_fk_user_id FOREIGN KEY (user_id) REFERENCES users (id)
) TABLESPACE pg_default;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_ratings_user_id ON public.ratings(user_id);
CREATE INDEX IF NOT EXISTS idx_ratings_entity_entity_id ON public.ratings(entity, entity_id);
CREATE INDEX IF NOT EXISTS idx_ratings_metric ON public.ratings(metric);
CREATE INDEX IF NOT EXISTS idx_ratings_pattern ON public.ratings(pattern);
