const { z } = require('zod');

const schema = z.object({
  foo: z.string().nullable(),
});

try {
  schema.parse({});
  console.log('Empty object passed');
} catch (e) {
  console.log('Empty object failed:', e.errors[0].message);
}

try {
  schema.parse({ foo: null });
  console.log('{ foo: null } passed');
} catch (e) {
  console.log('{ foo: null } failed');
}
