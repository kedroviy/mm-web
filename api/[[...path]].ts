import { AngularNodeAppEngine, createNodeRequestHandler, writeResponseToNodeResponse } from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';

// Vercel entrypoint for Angular SSR.
// It forwards all incoming requests to Angular's SSR engine.

const browserDistFolder = join(process.cwd(), 'dist/my-app/browser');
const angularApp = new AngularNodeAppEngine();
const app = express();

// Serve built static assets directly.
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

// Render everything else via Angular SSR.
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) => (response ? writeResponseToNodeResponse(response, res) : next()))
    .catch(next);
});

export default createNodeRequestHandler(app);

