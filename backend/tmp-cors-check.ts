/**
 * TEMPORARY verification script (deleted after the run).
 * Mirrors production: the API's FRONTEND_URL is the stable alias WITH a trailing
 * slash, and the browser is on a deployment hostname.
 * Usage: ts-node tmp-cors-check.ts [true|false]   (ALLOW_VERCEL_DEPLOYMENT_URLS)
 */
const allowDeployments = process.argv[2] !== 'false';

process.env.FRONTEND_URL = 'https://intern-management-system-kdjk.vercel.app/';
process.env.ALLOW_VERCEL_DEPLOYMENT_URLS = allowDeployments ? 'true' : 'false';
process.env.NODE_ENV = 'production';

/* eslint-disable @typescript-eslint/no-var-requires */
const app = require('./src/app').default;

const PORT = 4599;
const server = app.listen(PORT, async () => {
  const preflight = async (origin: string) => {
    const res = await fetch(`http://127.0.0.1:${PORT}/api/v1/auth/me`, {
      method: 'OPTIONS',
      headers: {
        Origin: origin,
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'authorization',
      },
    });
    return {
      status: res.status,
      acao: res.headers.get('access-control-allow-origin'),
      vary: res.headers.get('vary'),
    };
  };

  const cases: Array<[string, string, boolean]> = [
    [
      'https://intern-management-system-kdjk-h40xc5515.vercel.app',
      'deployment URL from the error report',
      allowDeployments,
    ],
    [
      'https://intern-management-system-kdjk-git-main-scope.vercel.app',
      'preview URL',
      allowDeployments,
    ],
    ['https://intern-management-system-kdjk.vercel.app', 'stable alias (no slash)', true],
    ['https://evil.example.com', 'unrelated domain', false],
    ['http://localhost:5173', 'not configured on this instance', false],
  ];

  console.log(
    `\n--- ALLOW_VERCEL_DEPLOYMENT_URLS=${allowDeployments ? 'true (default)' : 'false'} ---`,
  );

  let failures = 0;
  for (const [origin, label, shouldAllow] of cases) {
    const { status, acao, vary } = await preflight(origin);
    const allowed = acao === origin;
    const ok = allowed === shouldAllow;
    if (!ok) failures++;
    console.log(
      `${ok ? 'PASS' : 'FAIL'}  ${allowed ? 'ALLOW' : 'BLOCK'}  status=${status}  acao=${
        acao ?? '<none>'
      }  vary=${vary ?? '-'}  | ${label}`,
    );
  }

  console.log(failures === 0 ? 'ALL_CORS_CHECKS_PASSED' : `${failures} CHECK(S) FAILED`);
  server.close();
  process.exit(failures === 0 ? 0 : 1);
});
