// Thin Vercel wrapper: reuse the already-built Angular SSR handler.
// This avoids having to reconfigure AngularNodeAppEngine inside serverless.
export { reqHandler as default } from '../dist/my-app/server/server.mjs';

