/**
 * Vercel serverless entry point for the Intern Management System API.
 *
 * Vercel cannot run `src/server.ts` (it calls app.listen() to bind a port),
 * so this file re-exports the configured Express app from src/app.ts as a
 * request handler instead. `backend/vercel.json` rewrites every incoming
 * path to this function, so the existing `/api/v1/*` routes keep working
 * unchanged.
 *
 * This file is only used by Vercel. Local development still runs
 * `src/server.ts` via `npm run dev` and is unaffected.
 */
import app from '../src/app';

export default function handler(req: any, res: any) {
  return app(req, res);
}
