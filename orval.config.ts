import { faker } from '@faker-js/faker';
import { defineConfig } from 'orval';

export default defineConfig({
  moviematch: {
    input: {
      target: './swagger.json',
      validation: false,
      // override: {
      //   transformer: 'src/add-version.js',
      // },
    },
    output: {
      mode: 'tags-split',
      target: './src/core/api/generated',
      schemas: './src/core/api/model',
      client: 'angular',
      // httpClient: 'angular',
      mock: false,
      override: {
        // Включаем сериализацию параметров
        query: {
          useQuery: true,
          // Это заставит Orval корректно обрабатывать сложные объекты в params
        },
        // Добавьте это, если используете стандартный клиент
        paramsSerializer: {
          path: './src/app/core/utils/api/generate-api-utils.ts',
          name: 'customParamsSerializer',
        },
      },
      allParamsOptional: true,
      urlEncodeParameters: true,
    },
    // hooks: {
    //   afterAllFilesWrite: 'prettier --write',
    // },
  },
});
