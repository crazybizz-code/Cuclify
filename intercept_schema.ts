import { generateObject } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { z } from 'zod';
import http from 'http';
import { storeBlockSchema } from './config/store-config.schema';
import { StoreConfigMutationSchema } from './lib/store-config-mutations';

// Create a dummy server to intercept the request
const server = http.createServer((req, res) => {
  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', () => {
    try {
      const data = JSON.parse(body);
      console.log('--- INTERCEPTED JSON SCHEMA ---');
      const responseFormat = data.response_format;
      console.log(JSON.stringify(responseFormat, null, 2));
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        id: "chatcmpl-123",
        object: "chat.completion",
        created: 1677652288,
        model: "gpt-4",
        choices: [{
          index: 0,
          message: {
            role: "assistant",
            content: "{}"
          },
          finish_reason: "stop"
        }]
      }));
      server.close();
    } catch (e) {
      console.error(e);
      res.writeHead(500);
      res.end();
      server.close();
    }
  });
});

server.listen(4000, async () => {
  const dummyProvider = createOpenAI({
    baseURL: 'http://localhost:4000',
    apiKey: 'dummy',
  });

  try {
    await generateObject({
      model: dummyProvider('gpt-4'),
      schema: z.object({ mutations: z.array(StoreConfigMutationSchema) }),
      prompt: 'test',
    });
  } catch (e) {
    console.error("Error generating object:", e);
  }
});
