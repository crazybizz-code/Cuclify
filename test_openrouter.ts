import { generateObject } from 'ai';
import { z } from 'zod';
import { getAIModel, mapAIError } from './lib/ai-provider';

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
    console.log('Caught an error from OpenRouter. Testing graceful error mapping...');
    const userFriendlyMessage = mapAIError(error);
    console.error('Mapped Error Output =>', userFriendlyMessage);
  }
}

runTest();
