import { createOpenAI } from '@ai-sdk/openai';
import { APICallError } from 'ai';

const providerName = 'OpenRouter';
const defaultModel = 'openai/gpt-5-mini';
const modelId = process.env.MODEL_ID || defaultModel;

// Diagnostic logs on server startup
console.log(`[AI] Provider: ${providerName}`);
console.log(`[AI] Model: ${modelId}`);

// Configured OpenRouter provider instance
export const openrouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
});

export function getAIModel() {
  return openrouter(modelId);
}

// Maps common OpenRouter error statuses to user-friendly messages
export function mapAIError(error: unknown): string {
  if (error instanceof Error && (error.name === 'APICallError' || error.name === 'AI_APICallError')) {
    const apiError = error as APICallError & { statusCode?: number };
    const status = apiError.statusCode;
    
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
    
    return `AI Provider Error (${status}): ${apiError.message}`;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unknown error occurred during AI generation.';
}
