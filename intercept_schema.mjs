import { generateObject } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { z } from 'zod';
import http from 'http';

// Recreate the mutation schema exactly as it is in the project
const jsonPrimitiveSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);
const jsonValueL1Schema = z.union([jsonPrimitiveSchema, z.array(jsonPrimitiveSchema), z.array(z.object({ key: z.string(), value: jsonPrimitiveSchema }))]);
const jsonValueL2Schema = z.union([jsonValueL1Schema, z.array(jsonValueL1Schema), z.array(z.object({ key: z.string(), value: jsonValueL1Schema }))]);
const jsonValueL3Schema = z.union([jsonValueL2Schema, z.array(jsonValueL2Schema), z.array(z.object({ key: z.string(), value: jsonValueL2Schema }))]);

const blockStyleSchema = z.object({
  background: z.string().optional(),
  textColor: z.string().optional(),
  padding: z.string().optional(),
  layout: z.enum(['full-width', 'contained', 'narrow']).optional(),
});

const heroSchema = z.object({
  badge: z.string().catch(''),
  headline: z.string(),
  subheadline: z.string(),
  buttons: z.array(
    z.object({
      label: z.string(),
      href: z.string(),
      variant: z.enum(['primary', 'secondary', 'outline']),
    })
  ),
  image: z
    .object({
      src: z.string(),
      alt: z.string(),
    })
    .catch({src: '', alt: ''}),
  backgroundImage: z.string().catch(''),
  alignment: z.enum(['left', 'center', 'right']).catch('center'),
  overlayOpacity: z.number().min(0).max(1).catch(0),
});

const storeBlockSchema = z.discriminatedUnion('blockType', [
  z.object({ blockType: z.literal('hero'), id: z.string(), data: heroSchema, style: blockStyleSchema.optional() }),
]);

const mutationAddBlockSchema = z.object({
  op: z.literal('add_block'),
  block: storeBlockSchema,
  afterId: z.string().optional(),
});

const StoreConfigMutationSchema = z.discriminatedUnion('op', [
  mutationAddBlockSchema,
]);

const server = http.createServer((req, res) => {
  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', () => {
    try {
      const data = JSON.parse(body);
      console.log('--- INTERCEPTED REQUEST BODY ---');
      console.log(JSON.stringify(data, null, 2));
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
      model: dummyProvider('gpt-4o', { structuredOutputs: true }),
      schema: z.object({ mutations: z.array(StoreConfigMutationSchema) }),
      prompt: 'test',
    });
  } catch (e) {
    console.error("Error generating object:", e);
  }
});
