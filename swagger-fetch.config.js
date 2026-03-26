import { defineConfig } from 'orval';

export default defineConfig({
  baseOutput: 'src/core/api/swagger-generate',
  sources: [
    {
      name: 'my-api',
      input: './swagger.json',
    },
  ],
});
