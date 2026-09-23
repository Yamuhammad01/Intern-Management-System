import { CorsOptions } from 'cors';
import { env } from './environment';
import { logger } from '../utils/logger';

/**
 * Normalises an origin so it can be compared against the browser's `Origin`
 * header. Browsers never include a trailing slash, so a value like
 * `https://app.example.com/` in FRONTEND_URL silently never matches.
 */
export const normalizeOrigin = (origin: string): string =>
  origin.trim().replace(/\/+$/, '');

/**
 * `FRONTEND_URL` accepts a comma-separated list of origins, e.g.
 *   https://intern-management-system-kdjk.vercel.app,https://interns.example.com
 */
export const parseAllowedOrigins = (value: string): string[] =>
  value
    .split(',')
    .map(normalizeOrigin)
    .filter((origin) => origin.length > 0);

const ALLOWED_ORIGINS = parseAllowedOrigins(env.FRONTEND_URL);

/** Setting FRONTEND_URL to `*` allows every origin (handy for demos; avoid long term). */
const ALLOW_ANY_ORIGIN = ALLOWED_ORIGINS.includes('*');

/**
 * Vercel assigns every deployment its own hostname in addition to the stable
 * project alias, e.g.
 *   alias:      intern-management-system-kdjk.vercel.app
 *   deployment: intern-management-system-kdjk-h40xc5515.vercel.app
 *   preview:    intern-management-system-kdjk-git-main-user.vercel.app
 *
 * Configuring only the alias made every deployment/preview URL fail CORS, so for
 * each configured `*.vercel.app` origin we also accept sibling hosts that share
 * the same project prefix.
 */
const VERCEL_PROJECT_PREFIXES = ALLOWED_ORIGINS.flatMap((origin) => {
  try {
    const { protocol, hostname } = new URL(origin);
    if (protocol !== 'https:' || !hostname.endsWith('.vercel.app')) return [];
    return [hostname.slice(0, -'.vercel.app'.length)];
  } catch {
    return [];
  }
});

const isVercelSiblingOrigin = (origin: string): boolean => {
  if (!env.ALLOW_VERCEL_DEPLOYMENT_URLS) return false;

  try {
    const { protocol, hostname } = new URL(origin);
    if (protocol !== 'https:' || !hostname.endsWith('.vercel.app')) return false;
    return VERCEL_PROJECT_PREFIXES.some(
      (prefix) => hostname === `${prefix}.vercel.app` || hostname.startsWith(`${prefix}-`),
    );
  } catch {
    return false;
  }
};

/**
 * True when the given browser origin may call this API.
 * Requests without an `Origin` header (curl, health checks, server-to-server)
 * are always allowed — CORS only exists to constrain browsers.
 */
export const isOriginAllowed = (origin?: string): boolean => {
  if (!origin) return true;
  if (ALLOW_ANY_ORIGIN) return true;

  const candidate = normalizeOrigin(origin);
  return ALLOWED_ORIGINS.includes(candidate) || isVercelSiblingOrigin(candidate);
};

/** Origins we have already reported, so a misconfiguration cannot flood the logs. */
const reportedOrigins = new Set<string>();

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (isOriginAllowed(origin)) {
      return callback(null, true);
    }

    // Respond without an Access-Control-Allow-Origin header so the browser blocks
    // the request, and log it once — this is nearly always a stale/mistyped
    // FRONTEND_URL on the API deployment.
    const candidate = normalizeOrigin(origin as string);
    if (!reportedOrigins.has(candidate)) {
      reportedOrigins.add(candidate);
      logger.warn(
        `CORS: blocked origin "${candidate}". Allowed: ${
          ALLOWED_ORIGINS.join(', ') || '(none configured)'
        }. Set FRONTEND_URL on the API deployment to a comma-separated list of origins (no trailing slash).`,
      );
    }
    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  // Cache the preflight result so browsers stop sending an OPTIONS per request.
  maxAge: 86400,
  optionsSuccessStatus: 204,
};
