import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { StoreConfigMutationSchema } from './lib/store-config-mutations.js';

function makeStrict(schema) {
  if (!schema || typeof schema !== 'object') return;
  
  if (schema.type === 'object' && schema.properties) {
    const keys = Object.keys(schema.properties);
    schema.required = keys;
    schema.additionalProperties = false;
    for (const key of keys) {
      const prop = schema.properties[key];
      makeStrict(prop);
      // If it's optional in Zod, it might not have been required.
      // To allow the LLM to omit it logically, we add "null" to the type
      if (prop.type && typeof prop.type === 'string') {
        prop.type = [prop.type, "null"];
      } else if (prop.type && Array.isArray(prop.type)) {
        if (!prop.type.includes("null")) prop.type.push("null");
      } else if (prop.anyOf) {
        // OpenAI strict mode doesn't allow anyOf for nullable, it requires type: ["...", "null"]
        // Actually, Vercel AI SDK handles it. Let's see what happens if we just make everything required.
      }
    }
  } else if (schema.anyOf) {
    schema.anyOf.forEach(makeStrict);
  } else if (schema.items) {
    makeStrict(schema.items);
  }
}

const baseSchema = zodToJsonSchema(z.object({ mutations: z.array(StoreConfigMutationSchema) }), { target: "jsonSchema7" });
// Remove the $schema root property
delete baseSchema.$schema;

makeStrict(baseSchema);

console.log(JSON.stringify(baseSchema, null, 2));
