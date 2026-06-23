-- Update existing table to add new fields for targeted responses
ALTER TABLE conversions ADD COLUMN requested_language TEXT;
ALTER TABLE conversions ADD COLUMN explanation_type TEXT; -- 'funny' or 'scientific'
ALTER TABLE conversions ADD COLUMN measurement_type TEXT; -- 'length', 'width', 'height', 'area', 'weight', 'price'

-- Create new table for cached AI responses
CREATE TABLE ai_responses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- Cache key components
    measurement_type TEXT NOT NULL,
    measurement_value REAL NOT NULL,
    measurement_unit TEXT NOT NULL,
    result_value REAL NOT NULL,
    user_text_hash TEXT NOT NULL, -- SHA-256 hash of user text for privacy
    language TEXT NOT NULL,
    explanation_type TEXT NOT NULL, -- 'funny' or 'scientific'
    model_used TEXT NOT NULL,
    
    -- Cached response
    ai_response TEXT NOT NULL,
    
    -- Usage tracking
    usage_count INTEGER DEFAULT 1,
    last_used DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(measurement_type, measurement_value, measurement_unit, result_value, user_text_hash, language, explanation_type, model_used)
);

-- Create indexes for fast lookups
CREATE INDEX idx_ai_responses_cache_lookup ON ai_responses(
    measurement_type, measurement_value, measurement_unit, 
    result_value, user_text_hash, language, explanation_type, model_used
);
CREATE INDEX idx_ai_responses_usage ON ai_responses(usage_count DESC, last_used DESC);