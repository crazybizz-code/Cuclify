import { generateObject } from 'ai';
import { z } from 'zod';
import { createOpenAI } from '@ai-sdk/openai';

const providerName = 'OpenRouter';
const defaultModel = 'openai/gpt-5-mini';
const modelId = process.env.MODEL_ID || defaultModel;

// Diagnostic logs on server startup
console.log(`[AI] Provider: ${providerName}`);
console.log(`[AI] Model: ${modelId}`);

// Configured OpenRouter provider instance
const openrouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY || 'sk-or-v1-placeholder',
});

function getAIModel() {
  return openrouter(modelId);
}

// Maps common OpenRouter error statuses to user-friendly messages
function mapAIError(error) {
  if (error && (error.name === 'APICallError' || error.name === 'AI_APICallError')) {
    const status = error.statusCode;
    
    if (status === 401) {
      return 'Invalid API key. Please check your OpenRouter credentials.';
    }
    if (status === 402) {
      return 'Insufficient credits. Please top up your OpenRouter account.';
    }
    if (status === 429) {
      return 'Rate limit exceeded. Please wait a moment and try again.';
    }
    if (status && status >= 500) {
      return 'AI Provider is temporarily unavailable. Please try again later.';
    }
    
    return `AI Provider Error (${status}): ${error.message}`;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unknown error occurred during AI generation.';
}

const DummySchema = z.object({
  message: z.string(),
});

async function runTest() {
  console.log('--- Starting OpenRouter Migration Test ---');
  try {
    const { object } = await generateObject({
      model: getAIModel(),
      schema: DummySchema,
      prompt: 'Hello, world!',
    });
    console.log('Success:', object);
  } catch (error) {
    console.log('Caught an error from OpenRouter. Error name:', error.name);
    console.log('Error properties:', Object.keys(error));
    if (error.statusCode) console.log('Status code:', error.statusCode);
    const userFriendlyMessage = mapAIError(error);
    console.error('Mapped Error Output =>', userFriendlyMessage);
  }
}

runTest();
