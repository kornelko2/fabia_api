import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { z } from 'zod';

// Types for database
interface ConversionRequest {
  requestId: string;
  userText?: string;
  modelUsed?: string;
  inputLength?: { value: number; unit: string };
  inputWidth?: { value: number; unit: string };
  inputHeight?: { value: number; unit: string };
  inputArea?: { value: number; unit: string };
  inputWeight?: { value: number; unit: string };
  inputPrice?: { value: number; unit: string };
  results: any;
  aiResponse: string;
  clientIp?: string;
  userAgent?: string;
  processingTimeMs: number;
}

const app = new Hono();
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type'],
}));

// Škoda Fabia 1.2 HTP (64 HP) reference values (exact specifications)
const SKODA_FABIA_LENGTH_M = 4.002; // 4002 mm
const SKODA_FABIA_WIDTH_M = 1.646; // 1646 mm
const SKODA_FABIA_HEIGHT_M = 1.441; // 1441 mm
const SKODA_FABIA_WEIGHT_KG = 1035; // curb weight
const SKODA_FABIA_PRICE_EUR = 16500; // base price (not provided; kept for price conversions)
const SKODA_FABIA_AREA_M2 = SKODA_FABIA_LENGTH_M * SKODA_FABIA_WIDTH_M; // ~6.587 m²
const SKODA_FABIA_POWER_HP = 64; // 64 HP
const SKODA_FABIA_POWER_KW = 47; // 47 kW
const SKODA_FABIA_CONSUMPTION_L100KM = 5.9; // Combined consumption
const SKODA_FABIA_FUEL_TANK_L = 45; // 45 liters

const conversionSchema = z.object({
  length: z.object({ value: z.number(), unit: z.string() }).optional(),
  width: z.object({ value: z.number(), unit: z.string() }).optional(),
  height: z.object({ value: z.number(), unit: z.string() }).optional(),
  weight: z.object({ value: z.number(), unit: z.string() }).optional(),
  price: z.object({ value: z.number(), unit: z.string() }).optional(),
  area: z.object({ value: z.number(), unit: z.string() }).optional(),
  format: z.enum(['default', 'rounded', 'scientific']).optional()
});

// New targeted schema for /explain endpoint
const explainSchema = z.object({
  text: z.string(),
  model: z.string().optional(),
  language: z.enum(['czech', 'slovak', 'hungarian', 'polish', 'english', 'german', 'spanish', 'french']),
  explanationType: z.enum(['funny', 'scientific']),
  measurement: z.discriminatedUnion('type', [
    z.object({
      type: z.literal('length'),
      value: z.number(),
      unit: z.string()
    }),
    z.object({
      type: z.literal('width'),
      value: z.number(),
      unit: z.string()
    }),
    z.object({
      type: z.literal('height'),
      value: z.number(),
      unit: z.string()
    }),
    z.object({
      type: z.literal('area'),
      value: z.number(),
      unit: z.string()
    }),
    z.object({
      type: z.literal('weight'),
      value: z.number(),
      unit: z.string()
    }),
    z.object({
      type: z.literal('price'),
      value: z.number(),
      unit: z.string()
    }),
    z.object({
      type: z.literal('power'),
      value: z.number(),
      unit: z.string()
    }),
    z.object({
      type: z.literal('consumption'),
      value: z.number(),
      unit: z.string()
    })
  ])
});

function toMeters(value: number, fromUnit: string): number | null {
  switch (fromUnit) {
    case 'm': return value;
    case 'km': return value * 1000;
    case 'mi': return value * 1609.34;
    case 'ft': return value * 0.3048;
    case 'yd': return value * 0.9144;
    case 'cm': return value * 0.01;
    case 'mm': return value * 0.001;
    default: return null;
  }
}

function convert(value: number, fromUnit: string, toUnit: string): number | null {
  if (toUnit === 'skodafabia') {
    const meters = toMeters(value, fromUnit);
    if (meters === null) return null;
    return meters / SKODA_FABIA_LENGTH_M;
  }
  if (fromUnit === 'skodafabia') {
    const meters = value * SKODA_FABIA_LENGTH_M;
    switch (toUnit) {
      case 'm': return meters;
      case 'km': return meters / 1000;
      case 'mi': return meters / 1609.34;
      case 'ft': return meters / 0.3048;
      case 'yd': return meters / 0.9144;
      case 'cm': return meters / 0.01;
      case 'mm': return meters / 0.001;
      default: return null;
    }
  }
  if (fromUnit === toUnit) return value;
  if (fromUnit === 'km' && toUnit === 'mi') return value * 0.621371;
  if (fromUnit === 'mi' && toUnit === 'km') return value / 0.621371;
  if (fromUnit === 'C' && toUnit === 'F') return value * 9/5 + 32;
  if (fromUnit === 'F' && toUnit === 'C') return (value - 32) * 5/9;
  if (fromUnit === 'kmh' && toUnit === 'mph') return value * 0.621371;
  if (fromUnit === 'mph' && toUnit === 'kmh') return value / 0.621371;
  return null;
}

// Area conversion function
function toSquareMeters(value: number, fromUnit: string): number | null {
  switch (fromUnit) {
    case 'm2':
    case 'sqm': return value;
    case 'km2': return value * 1000000;
    case 'cm2': return value * 0.0001;
    case 'mm2': return value * 0.000001;
    case 'ft2': return value * 0.092903;
    case 'in2': return value * 0.00064516;
    case 'yd2': return value * 0.836127;
    case 'acre': return value * 4046.86;
    case 'hectare': return value * 10000;
    default: return null;
  }
}

// Function to generate hash for user text (for privacy in caching)
async function hashText(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Function to check cache for existing AI response
async function getCachedResponse(
  db: any,
  measurementType: string,
  measurementValue: number,
  measurementUnit: string,
  resultValue: number,
  userTextHash: string,
  language: string,
  explanationType: string,
  model: string
): Promise<string | null> {
  try {
    const stmt = db.prepare(`
      SELECT ai_response FROM ai_responses 
      WHERE measurement_type = ? AND measurement_value = ? AND measurement_unit = ? 
      AND result_value = ? AND user_text_hash = ? AND language = ? 
      AND explanation_type = ? AND model_used = ?
    `);
    
    const result = await stmt.bind(
      measurementType, measurementValue, measurementUnit, resultValue,
      userTextHash, language, explanationType, model
    ).first();
    
    if (result) {
      // Update usage stats
      const updateStmt = db.prepare(`
        UPDATE ai_responses 
        SET usage_count = usage_count + 1, last_used = CURRENT_TIMESTAMP 
        WHERE measurement_type = ? AND measurement_value = ? AND measurement_unit = ? 
        AND result_value = ? AND user_text_hash = ? AND language = ? 
        AND explanation_type = ? AND model_used = ?
      `);
      
      await updateStmt.bind(
        measurementType, measurementValue, measurementUnit, resultValue,
        userTextHash, language, explanationType, model
      ).run();
      
      console.log(`Cache hit for ${measurementType} conversion`);
      return result.ai_response;
    }
    
    return null;
  } catch (error) {
    console.error('Error checking cache:', error);
    return null;
  }
}

// Function to save AI response to cache
async function cacheResponse(
  db: any,
  measurementType: string,
  measurementValue: number,
  measurementUnit: string,
  resultValue: number,
  userTextHash: string,
  language: string,
  explanationType: string,
  model: string,
  aiResponse: string
): Promise<void> {
  try {
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO ai_responses (
        measurement_type, measurement_value, measurement_unit, result_value,
        user_text_hash, language, explanation_type, model_used, ai_response
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    await stmt.bind(
      measurementType, measurementValue, measurementUnit, resultValue,
      userTextHash, language, explanationType, model, aiResponse
    ).run();
    
    console.log(`Cached response for ${measurementType} conversion`);
  } catch (error) {
    console.error('Error caching response:', error);
  }
}

// Function to save conversion data to D1 database
async function saveConversionToDatabase(db: any, data: ConversionRequest): Promise<void> {
  try {
    const stmt = db.prepare(`
      INSERT INTO conversions (
        request_id, user_text, model_used,
        input_length_value, input_length_unit,
        input_width_value, input_width_unit,
        input_height_value, input_height_unit,
        input_area_value, input_area_unit,
        input_weight_value, input_weight_unit,
        input_price_value, input_price_unit,
        result_length, result_width, result_height,
        result_area, result_weight, result_price,
        ai_response, client_ip, user_agent, processing_time_ms
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    await stmt.bind(
      data.requestId,
      data.userText || null,
      data.modelUsed || null,
      data.inputLength?.value || null,
      data.inputLength?.unit || null,
      data.inputWidth?.value || null,
      data.inputWidth?.unit || null,
      data.inputHeight?.value || null,
      data.inputHeight?.unit || null,
      data.inputArea?.value || null,
      data.inputArea?.unit || null,
      data.inputWeight?.value || null,
      data.inputWeight?.unit || null,
      data.inputPrice?.value || null,
      data.inputPrice?.unit || null,
      data.results.length || null,
      data.results.width || null,
      data.results.height || null,
      data.results.area || null,
      data.results.weight || null,
      data.results.price || null,
      data.aiResponse,
      data.clientIp || null,
      data.userAgent || null,
      data.processingTimeMs
    ).run();
    
    console.log(`Saved conversion ${data.requestId} to database`);
  } catch (error) {
    console.error('Error saving to database:', error);
    // Don't throw error to prevent API failure if DB save fails
  }
}

// Helper to call OpenAI API
async function getAIExplanation(prompt: string, apiKey: string, model?: string, allowedModels?: string[], defaultModel?: string): Promise<string> {
  // Validate and set model
  const allowedModelsList = allowedModels || ['gpt-5-mini','gpt-4','gpt-4-turbo','gpt-3.5-turbo'];
  const selectedModel = model && allowedModelsList.includes(model) ? model : (defaultModel || 'gpt-5-mini');
  
  const url = 'https://api.openai.com/v1/chat/completions';
  
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: selectedModel,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error(`OpenAI API error: ${res.status} - ${errorText}`);
      return 'AI response unavailable.';
    }
    
    const data = await res.json();
    return data.choices?.[0]?.message?.content || 'AI response unavailable.';
  } catch (error) {
    console.error('OpenAI API fetch error:', error);
    return 'AI response unavailable.';
  }
}

app.post('/convert', async (c) => {
  const body = await c.req.json();
  const parse = conversionSchema.safeParse(body);
  if (!parse.success) {
    // @ts-ignore
    return c.json({ error: 'Invalid input', details: parse.error.issues }, 400);
  }
  const { length, width, height, weight, price, area, format = 'default' } = parse.data;

  function formatValue(val: number | null): number | string | null {
    if (val === null) return null;
    if (format === 'rounded') return Math.round(val * 100) / 100;
    if (format === 'scientific') return val.toExponential(2);
    return val;
  }

  // Helper for each property
  function convertProp(input: any, refValue: number, toBase: (v: number, u: string) => number | null): any {
    if (!input) return null;
    const base = toBase(input.value, input.unit);
    if (base === null) return null;
    return base / refValue;
  }

  // Weight conversion
  function toKg(value: number, unit: string): number | null {
    switch (unit) {
      case 'kg': return value;
      case 'g': return value / 1000;
      case 'lb': return value * 0.453592;
      case 't': return value * 1000;
      default: return null;
    }
  }
  // Price conversion
  function toEur(value: number, unit: string): number | null {
    switch (unit) {
      case 'eur': return value;
      case 'usd': return value * 0.95; // Example rate
      case 'pln': return value * 0.23; // Example rate
      case 'czk': return value * 0.04; // Example rate
      default: return null;
    }
  }

  const response: any = {
    input: {
      length,
      width,
      height,
      weight,
      price,
      area
    },
    skodafabia: {}
  };

  if (length) {
    response.skodafabia.length = formatValue(convertProp(length, SKODA_FABIA_LENGTH_M, toMeters));
    response.skodafabia.lengthUnit = 'skodafabia';
  }
  if (width) {
    response.skodafabia.width = formatValue(convertProp(width, SKODA_FABIA_WIDTH_M, toMeters));
    response.skodafabia.widthUnit = 'skodafabia';
  }
  if (height) {
    response.skodafabia.height = formatValue(convertProp(height, SKODA_FABIA_HEIGHT_M, toMeters));
    response.skodafabia.heightUnit = 'skodafabia';
  }
  if (weight) {
    response.skodafabia.weight = formatValue(convertProp(weight, SKODA_FABIA_WEIGHT_KG, toKg));
    response.skodafabia.weightUnit = 'skodafabia';
  }
  if (price) {
    response.skodafabia.price = formatValue(convertProp(price, SKODA_FABIA_PRICE_EUR, toEur));
    response.skodafabia.priceUnit = 'skodafabia';
  }
  if (area) {
    response.skodafabia.area = formatValue(convertProp(area, SKODA_FABIA_AREA_M2, toSquareMeters));
    response.skodafabia.areaUnit = 'skodafabia';
  }

  return c.json(response);
});

app.post('/explain', async (c) => {
  const startTime = Date.now();
  const requestId = crypto.randomUUID();
  
  const body = await c.req.json();
  const parse = explainSchema.safeParse(body);
  if (!parse.success) {
    // @ts-ignore
    return c.json({ error: 'Invalid input', details: parse.error.issues }, 400);
  }
  
  const { text, language, explanationType, measurement, model } = parse.data;
  
  // Calculate conversion result
  let resultValue: number | null = null;
  let referenceValue: number;
  let conversionFunction: (value: number, unit: string) => number | null;
  
  switch (measurement.type) {
    case 'length':
      referenceValue = SKODA_FABIA_LENGTH_M;
      conversionFunction = toMeters;
      break;
    case 'width':
      referenceValue = SKODA_FABIA_WIDTH_M;
      conversionFunction = toMeters;
      break;
    case 'height':
      referenceValue = SKODA_FABIA_HEIGHT_M;
      conversionFunction = toMeters;
      break;
    case 'area':
      referenceValue = SKODA_FABIA_AREA_M2;
      conversionFunction = toSquareMeters;
      break;
    case 'weight':
      referenceValue = SKODA_FABIA_WEIGHT_KG;
      conversionFunction = (value: number, unit: string): number | null => {
        switch (unit) {
          case 'kg': return value;
          case 'g': return value / 1000;
          case 'lb': return value * 0.453592;
          case 't': return value * 1000;
          default: return null;
        }
      };
      break;
    case 'price':
      referenceValue = SKODA_FABIA_PRICE_EUR;
      conversionFunction = (value: number, unit: string): number | null => {
        switch (unit) {
          case 'eur': return value;
          case 'usd': return value * 0.95;
          case 'pln': return value * 0.23;
          case 'czk': return value * 0.04;
          default: return null;
        }
      };
      break;
    case 'power':
      referenceValue = SKODA_FABIA_POWER_HP;
      conversionFunction = (value: number, unit: string): number | null => {
        switch (unit) {
          case 'hp': return value;
          case 'kw': return value * 1.34102; // kW to HP
          case 'ps': return value; // PS ≈ HP
          default: return null;
        }
      };
      break;
    case 'consumption':
      referenceValue = SKODA_FABIA_CONSUMPTION_L100KM;
      conversionFunction = (value: number, unit: string): number | null => {
        switch (unit) {
          case 'l/100km': return value;
          case 'l/h': return value; // Direct comparison for now
          case 'mpg': return 235.214 / value; // US MPG to L/100km
          case 'l/km': return value * 100; // L/km to L/100km
          default: return null;
        }
      };
      break;
    default:
      return c.json({ error: 'Invalid measurement type' }, 400);
  }
  
  const baseValue = conversionFunction(measurement.value, measurement.unit);
  if (baseValue === null) {
    return c.json({ error: 'Invalid unit for measurement type' }, 400);
  }
  
  resultValue = baseValue / referenceValue;
  
  // Get AI configuration
  const aiKey = (c.env as any)?.AI_API_KEY;
  const allowedModelsStr = (c.env as any)?.ALLOWED_MODELS;
  const defaultModel = (c.env as any)?.DEFAULT_MODEL;
  const allowedModels = allowedModelsStr ? allowedModelsStr.split(',').map((m: string) => m.trim()) : ['gpt-5-mini','gpt-4','gpt-4-turbo','gpt-3.5-turbo'];
  const selectedModel = model && allowedModels.includes(model) ? model : (defaultModel || 'gpt-5-mini');
  
  let aiResponse = 'AI integration not configured.';
  
  if (aiKey) {
    const db = (c.env as any)?.skoda_fabia_conversions;
    let userTextHash = '';
    
    if (db) {
      userTextHash = await hashText(text);
      
      // Try to get cached response
      const cachedResponse = await getCachedResponse(
        db, measurement.type, measurement.value, measurement.unit, 
        resultValue, userTextHash, language, explanationType, selectedModel
      );
      
      if (cachedResponse) {
        aiResponse = cachedResponse;
      } else {
        // Generate new response
        const prompt = createTargetedPrompt(measurement, resultValue, text, language, explanationType);
        aiResponse = await getAIExplanation(prompt, aiKey, selectedModel, allowedModels, defaultModel);
        
        // Cache the response
        await cacheResponse(
          db, measurement.type, measurement.value, measurement.unit,
          resultValue, userTextHash, language, explanationType, selectedModel, aiResponse
        );
      }
    } else {
      // No database, just generate response
      const prompt = createTargetedPrompt(measurement, resultValue, text, language, explanationType);
      aiResponse = await getAIExplanation(prompt, aiKey, selectedModel, allowedModels, defaultModel);
    }
  }
  
  const processingTime = Date.now() - startTime;
  
  // Save to database (simplified for targeted approach)
  const db = (c.env as any)?.skoda_fabia_conversions;
  if (db) {
    try {
      const stmt = db.prepare(`
        INSERT INTO conversions (
          request_id, user_text, model_used, requested_language, 
          explanation_type, measurement_type, 
          ai_response, client_ip, user_agent, processing_time_ms
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      await stmt.bind(
        requestId, text, selectedModel, language, explanationType, measurement.type,
        aiResponse,
        c.req.header('CF-Connecting-IP') || c.req.header('X-Forwarded-For'),
        c.req.header('User-Agent'), processingTime
      ).run();
    } catch (error) {
      console.error('Error saving to database:', error);
    }
  }
  
  return c.json({
    requestId,
    input: {
      measurement: measurement,
      text: text,
      language: language,
      explanationType: explanationType
    },
    conversion: {
      type: measurement.type,
      inputValue: measurement.value,
      inputUnit: measurement.unit,
      resultValue: Math.round(resultValue * 1000) / 1000,
      resultUnit: 'skoda-fabia',
      calculation: `${measurement.value} ${measurement.unit} ÷ ${referenceValue} = ${Math.round(resultValue * 1000) / 1000} Skoda Fabias`
    },
    aiResponse: aiResponse,
    processingTimeMs: processingTime,
    cached: false // Will be updated in the caching logic
  });
});

// Helper function to create targeted prompts
function createTargetedPrompt(
  measurement: any, 
  resultValue: number, 
  userText: string, 
  language: string, 
  explanationType: string
): string {
  const languageMap = {
    czech: 'Czech (Čeština)',
    slovak: 'Slovak (Slovenčina)', 
    hungarian: 'Hungarian (Magyar)',
    polish: 'Polish (Polski)',
    english: 'English',
    german: 'German (Deutsch)',
    spanish: 'Spanish (Español)',
    french: 'French (Français)'
  };
  
  const explanationTypeText = explanationType === 'funny' ? 'funny, humorous' : 'scientific, educational';
  
  return `Convert ${measurement.value} ${measurement.unit} to Skoda Fabia units for ${measurement.type}.

Result: ${Math.round(resultValue * 1000) / 1000} Skoda Fabias

Context: ${userText}

Please provide a ${explanationTypeText} explanation in ${languageMap[language as keyof typeof languageMap]}.

${explanationType === 'scientific' ? 
  'Include scientific concepts like dimensional analysis, scaling laws, measurement standards, and practical applications.' :
  'Make it creative, entertaining, and imaginative while staying informative.'
}

Keep the response concise (max 150 words).`;
}

// Get recent conversions endpoint
app.get('/conversions', async (c) => {
  const db = (c.env as any)?.skoda_fabia_conversions;
  if (!db) {
    return c.json({ error: 'Database not configured' }, 500);
  }

  try {
    const limit = parseInt(c.req.query('limit') || '10');
    const offset = parseInt(c.req.query('offset') || '0');
    
    const stmt = db.prepare(`
      SELECT 
        id, request_id, created_at, user_text, model_used,
        input_length_value, input_length_unit,
        input_width_value, input_width_unit,
        input_height_value, input_height_unit,
        input_area_value, input_area_unit,
        result_length, result_width, result_height, result_area,
        processing_time_ms
      FROM conversions 
      ORDER BY created_at DESC 
      LIMIT ? OFFSET ?
    `);
    
    const results = await stmt.bind(limit, offset).all();
    
    const countStmt = db.prepare('SELECT COUNT(*) as total FROM conversions');
    const countResult = await countStmt.first();
    
    return c.json({
      conversions: results.results || [],
      total: countResult?.total || 0,
      limit,
      offset
    });
  } catch (error) {
    console.error('Error fetching conversions:', error);
    return c.json({ error: 'Failed to fetch conversions' }, 500);
  }
});

// Get conversion by ID endpoint
app.get('/conversions/:id', async (c) => {
  const db = (c.env as any)?.skoda_fabia_conversions;
  if (!db) {
    return c.json({ error: 'Database not configured' }, 500);
  }

  try {
    const requestId = c.req.param('id');
    const stmt = db.prepare('SELECT * FROM conversions WHERE request_id = ?');
    const result = await stmt.bind(requestId).first();
    
    if (!result) {
      return c.json({ error: 'Conversion not found' }, 404);
    }
    
    return c.json({ conversion: result });
  } catch (error) {
    console.error('Error fetching conversion:', error);
    return c.json({ error: 'Failed to fetch conversion' }, 500);
  }
});

// Get available models endpoint
app.get('/models', async (c) => {
  const allowedModelsStr = (c.env as any)?.ALLOWED_MODELS;
  const defaultModel = (c.env as any)?.DEFAULT_MODEL;
  
  const allowedModels = allowedModelsStr ? allowedModelsStr.split(',').map((m: string) => m.trim()) : ['gpt-3.5-turbo', 'gpt-4'];
  
  return c.json({
    allowedModels,
    defaultModel: defaultModel || 'gpt-3.5-turbo',
    usage: {
      explanation: 'Include "model" field in /explain requests to specify which model to use',
      example: {
        model: 'gpt-4',
        text: 'Your conversion context',
        length: { value: 10, unit: 'm' }
      }
    }
  });
});

// Get statistics endpoint
app.get('/stats', async (c) => {
  const db = (c.env as any)?.skoda_fabia_conversions;
  if (!db) {
    return c.json({ error: 'Database not configured' }, 500);
  }

  try {
    // Get total requests from ai_responses (unique conversions)
    const totalRequestsStmt = db.prepare('SELECT COUNT(*) as total FROM ai_responses');
    const totalRequests = await totalRequestsStmt.first();

    // Get cache hit statistics
    const cacheStatsStmt = db.prepare(`
      SELECT 
        SUM(usage_count) as total_requests_served,
        COUNT(*) as unique_conversions,
        AVG(usage_count) as avg_reuse_rate
      FROM ai_responses
    `);
    const cacheStats = await cacheStatsStmt.first();

    // Get conversion type breakdown
    const typeStatsStmt = db.prepare(`
      SELECT 
        measurement_type,
        COUNT(*) as count,
        SUM(usage_count) as total_served
      FROM ai_responses 
      GROUP BY measurement_type 
      ORDER BY count DESC
    `);
    const typeStatsResult = await typeStatsStmt.all();
    const typeStats = typeStatsResult.results || [];

    // Get recent conversions with actual values
    const recentConversionsStmt = db.prepare(`
      SELECT 
        measurement_type,
        measurement_value,
        measurement_unit,
        result_value,
        usage_count,
        created_at,
        last_used,
        language,
        ai_response
      FROM ai_responses 
      ORDER BY created_at DESC 
      LIMIT 10
    `);
    const recentConversionsResult = await recentConversionsStmt.all();
    const recentConversions = recentConversionsResult.results || [];

    // Get most popular conversions
    const popularConversionsStmt = db.prepare(`
      SELECT 
        measurement_type,
        measurement_value,
        measurement_unit,
        result_value,
        usage_count,
        created_at,
        language,
        ai_response
      FROM ai_responses 
      ORDER BY usage_count DESC 
      LIMIT 5
    `);
    const popularConversionsResult = await popularConversionsStmt.all();
    const popularConversions = popularConversionsResult.results || [];

    // Get language usage statistics
    const languageStatsStmt = db.prepare(`
      SELECT 
        language,
        COUNT(*) as count,
        SUM(usage_count) as total_served
      FROM ai_responses 
      GROUP BY language 
      ORDER BY count DESC
    `);
    const languageStatsResult = await languageStatsStmt.all();
    const languageStats = languageStatsResult.results || [];

    return c.json({
      overview: {
        totalUniqueConversions: totalRequests?.total || 0,
        totalRequestsServed: cacheStats?.total_requests_served || 0,
        cacheHitRate: cacheStats?.total_requests_served && cacheStats?.unique_conversions ? 
          ((cacheStats.total_requests_served - cacheStats.unique_conversions) / cacheStats.total_requests_served * 100).toFixed(1) + '%' : '0%',
        averageReuseRate: cacheStats?.avg_reuse_rate ? parseFloat(cacheStats.avg_reuse_rate.toFixed(2)) : 0
      },
      conversionTypes: typeStats,
      recentConversions: recentConversions,
      popularConversions: popularConversions,
      languageUsage: languageStats,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return c.json({ error: 'Failed to fetch statistics' }, 500);
  }
});

export default app;

export const onRequest = app.fetch;
