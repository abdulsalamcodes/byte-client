const AUTH_TOKEN_KEY = 'byte-auth-token';

// The API is on another origin, so auth uses a bearer token rather than cookies.
export function readAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(AUTH_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function storeAuthToken(token: string) {
  try {
    window.localStorage.setItem(AUTH_TOKEN_KEY, token);
  } catch {
    // Storage can be unavailable (private mode); the session then lasts for this page only.
  }
}

export function clearAuthToken() {
  try {
    window.localStorage.removeItem(AUTH_TOKEN_KEY);
  } catch {
    // Nothing to clear when storage is unavailable.
  }
}
