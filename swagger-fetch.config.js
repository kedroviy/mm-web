import { defineConfig } from '@serggrey1992/swagger-fetch';

module.exports = {
  baseOutput: 'src/core/api/swagger-generate',
  sources: [
    {
      name: 'my-api',
      input: 'https://api.moviematch.space/api/docs-json',
    },
  ],
};
