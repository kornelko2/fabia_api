-- Create table for storing conversion requests and responses
CREATE TABLE conversions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    request_id TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- Request data
    user_text TEXT,
    model_used TEXT,
    
    -- Input measurements
    input_length_value REAL,
    input_length_unit TEXT,
    input_width_value REAL,
    input_width_unit TEXT,
    input_height_value REAL,
    input_height_unit TEXT,
    input_area_value REAL,
    input_area_unit TEXT,
    input_weight_value REAL,
    input_weight_unit TEXT,
    input_price_value REAL,
    input_price_unit TEXT,
    
    -- Conversion results (in Skoda Fabia units)
    result_length REAL,
    result_width REAL,
    result_height REAL,
    result_area REAL,
    result_weight REAL,
    result_price REAL,
    
    -- AI response
    ai_response TEXT,
    
    -- Metadata
    client_ip TEXT,
    user_agent TEXT,
    processing_time_ms INTEGER
);

-- Create index for faster queries
CREATE INDEX idx_conversions_created_at ON conversions(created_at);
CREATE INDEX idx_conversions_request_id ON conversions(request_id);
CREATE INDEX idx_conversions_model ON conversions(model_used);