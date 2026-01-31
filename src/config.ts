import 'dotenv/config';
import * as z from 'zod';

const envSchema = z.object({
  QUANTIX_API_URL: z.string().default('https://api.quantix.example.com'),
  QUANTIX_API_KEY: z.string().min(1, "QUANTIX_API_KEY is required"),
  MCPPORT: z.string().optional().default('3001'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

const processEnv = {
  QUANTIX_API_URL: process.env.QUANTIX_API_URL,
  QUANTIX_API_KEY: process.env.QUANTIX_API_KEY,
  MCPPORT: process.env.MCPPORT,
  NODE_ENV: process.env.NODE_ENV,
};

// Parse and validate environment variables
const parsedEnv = envSchema.safeParse(processEnv);

if (!parsedEnv.success) {
  console.error("❌ Invalid environment variables:", parsedEnv.error.format());
  
  // In a real app, we might want to throw here, but for now we'll just log
  // and let the application fail when it tries to use the missing keys if essential
  if (process.env.NODE_ENV !== 'test') {
      // Allow tests to run without all env vars if they mock config
  }
}

export const config = parsedEnv.success ? parsedEnv.data : {
    QUANTIX_API_URL: process.env.QUANTIX_API_URL || 'https://api.quantix.example.com',
    QUANTIX_API_KEY: process.env.QUANTIX_API_KEY || 'your_api_key_here',
    MCPPORT: process.env.MCPPORT || '3001',
    NODE_ENV: (process.env.NODE_ENV as 'development' | 'production' | 'test') || 'development'
};
