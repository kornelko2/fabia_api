import { Hono } from 'hono';
import { z } from 'zod';

const app = new Hono();

// Define the expected input schema
const conversionSchema = z.object({
  value: z.number(),
  fromUnit: z.string(),
  toUnit: z.string(),
  format: z.enum(['default', 'rounded', 'scientific']).optional()
});


// Skoda Fabia length in meters
const SKODA_FABIA_LENGTH_M = 4.1;

// Helper: convert any supported length unit to meters
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

// Main conversion logic
function convert(value: number, fromUnit: string, toUnit: string): number | null {
  // Length to Skoda Fabia
  if (toUnit === 'skodafabia') {
    const meters = toMeters(value, fromUnit);
    if (meters === null) return null;
    return meters / SKODA_FABIA_LENGTH_M;
  }
  // Skoda Fabia to other length
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
  // Standard conversions
  if (fromUnit === toUnit) return value;
  // Length
  if (fromUnit === 'km' && toUnit === 'mi') return value * 0.621371;
  if (fromUnit === 'mi' && toUnit === 'km') return value / 0.621371;
  // Temperature
  if (fromUnit === 'C' && toUnit === 'F') return value * 9/5 + 32;
  if (fromUnit === 'F' && toUnit === 'C') return (value - 32) * 5/9;
  // Speed
  if (fromUnit === 'kmh' && toUnit === 'mph') return value * 0.621371;
  if (fromUnit === 'mph' && toUnit === 'kmh') return value / 0.621371;
  // Add more conversions as needed
  return null;
}

app.post('/convert', async (c) => {
  const body = await c.req.json();
  const parse = conversionSchema.safeParse(body);
  if (!parse.success) {
    // @ts-ignore
    return c.json({ error: 'Invalid input', details: parse.error.issues }, 400);
  }
  const { value, fromUnit, toUnit, format = 'default' } = parse.data;
  let result = convert(value, fromUnit, toUnit);
  if (result === null) {
    return c.json({ error: 'Conversion not supported' }, 400);
  }
  let formatted: number | string = result;
  if (format === 'rounded') {
    formatted = Math.round(result * 100) / 100;
  } else if (format === 'scientific') {
    formatted = result.toExponential(2);
  }
  return c.json({ result: formatted });
});

export default app;

// @ts-ignore
if (import.meta.main) {
  // @ts-ignore
  Bun.serve({ fetch: app.fetch, port: 3001 });
}
