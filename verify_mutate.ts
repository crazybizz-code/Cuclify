import { generateObject } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { StoreConfigMutationBatchSchema } from './lib/store-config-mutations';
import fs from 'fs';
import path from 'path';

// Parse .env.local manually to load environment variables
try {
  const envFile = fs.readFileSync(path.resolve(process.cwd(), '.env.local'), 'utf-8');
  for (const line of envFile.split('\n')) {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || '';
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      process.env[key] = value;
    }
  }
} catch (e) {
  console.log('No .env.local found or error parsing it');
}

const modelId = process.env.MODEL_ID || 'openai/gpt-5-mini';
const apiKey = process.env.OPENROUTER_API_KEY;

if (!apiKey) {
  console.error('Missing OPENROUTER_API_KEY');
  process.exit(1);
}

const openrouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: apiKey,
});

async function runTest() {
  console.log('--- Verifying Mutation Schema with OpenRouter ---');
  try {
    const { object } = await generateObject({
      model: openrouter(modelId),
      schema: StoreConfigMutationBatchSchema,
      prompt: 'Change the hero section headline to "Test Headline"',
    });
    console.log('Success! Received object:', JSON.stringify(object, null, 2));
  } catch (error: any) {
    console.log('Caught an error from OpenRouter. Error name:', error.name);
    console.log('Message:', error.message);
    if (error.statusCode) console.log('Status code:', error.statusCode);
  }
}

runTest();
