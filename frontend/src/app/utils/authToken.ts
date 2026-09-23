

const ACCESS_TOKEN_KEY = "accessToken";

/** Legacy key. Kept in sync so sessions created before this fix keep working. */
const LEGACY_TOKEN_KEY = "token";

/**
 * Returns the stored access token, or `null` when the user has no session.
 * Prefers the canonical key and falls back to the legacy one.
 */
export function getAccessToken(): string | null {
  return (
    localStorage.getItem(ACCESS_TOKEN_KEY) ||
    localStorage.getItem(LEGACY_TOKEN_KEY) ||
    null
  );
}

/**
 * Persists the access token. Writes both keys so un-migrated call sites that
 * still read `token` keep working.
 */
export function setAccessToken(token: string): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
  localStorage.setItem(LEGACY_TOKEN_KEY, token);
}

/** Removes every trace of the access token (used on logout / 401). */
export function clearAccessToken(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(LEGACY_TOKEN_KEY);
}

/**
 * Builds an `Authorization` header only when a token is actually available.
 * Never returns a bare `Bearer` value, which the API rejects.
 */
export function authHeader(): Record<string, string> {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}
