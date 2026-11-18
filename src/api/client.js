// Single entry point for talking to the API gateway.
//
// Auth model (Backend-for-Frontend): the gateway keeps the OAuth2 tokens in an HttpOnly
// session cookie, so no token is ever stored in JavaScript / localStorage. State-changing
// requests must echo the gateway's XSRF-TOKEN cookie in the X-XSRF-TOKEN header.

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

export class ApiError extends Error {
  constructor(message, status, fieldErrors = {}, { offline = false } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.fieldErrors = fieldErrors;
    /** True when no API server answered (network error, proxy error, or static host). */
    this.offline = offline;
  }
}

const OFFLINE_MESSAGE = "Can't reach the OpenJar server right now. Please try again later.";
const offlineError = () => new ApiError(OFFLINE_MESSAGE, 0, {}, { offline: true });

/** Gateway/proxy errors mean the backend itself is down, not that the request was bad. */
const isGatewayDown = (status) => status === 502 || status === 503 || status === 504;

function readCookie(name) {
  const match = document.cookie.split('; ').find(row => row.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split('=')[1]) : null;
}

export async function getCsrfToken() {
  let token = readCookie('XSRF-TOKEN');
  if (!token) {
    // Any response from the gateway sets the cookie; this endpoint is just the cheapest one.
    try {
      await fetch('/api/csrf', { credentials: 'include' });
    } catch {
      throw offlineError();
    }
    token = readCookie('XSRF-TOKEN');
  }
  return token;
}

let onUnauthorized = () => {};
/** Lets the AuthContext react when the session expires mid-use. */
export function setUnauthorizedHandler(fn) {
  onUnauthorized = fn;
}

function messageFor(status, body) {
  if (body && typeof body === 'object' && body.message) return body.message;
  if (typeof body === 'string' && body && body.length < 300 && !body.trim().startsWith('<')) return body;
  if (status === 401) return 'Please sign in to continue.';
  if (status === 403) return "You don't have permission to do that.";
  if (status === 404) return 'Not found.';
  if (status === 429) return 'Too many requests. Please wait a moment.';
  if (status >= 500) return 'The server ran into a problem. Please try again.';
  return 'Request failed.';
}

export async function apiFetch(path, { method = 'GET', body, headers = {}, ...rest } = {}) {
  const upper = method.toUpperCase();
  const finalHeaders = { Accept: 'application/json', ...headers };

  if (body !== undefined) {
    finalHeaders['Content-Type'] = 'application/json';
  }
  if (!SAFE_METHODS.has(upper)) {
    const csrf = await getCsrfToken();
    if (csrf) finalHeaders['X-XSRF-TOKEN'] = csrf;
  }

  let res;
  const started = performance.now();
  try {
    res = await fetch(path, {
      method: upper,
      credentials: 'include',
      headers: finalHeaders,
      body: body === undefined ? undefined : JSON.stringify(body),
      ...rest,
    });
  } catch (err) {
    if (err?.name === 'AbortError') throw err;
    throw offlineError();
  }

  // A static host (e.g. Vercel without an API rewrite) answers API paths with the SPA's
  // index.html and status 200. Never treat that page as data: it would look like a
  // successful response (even a "logged-in user").
  // Likewise an error that did not come from our gateway (it stamps every response with
  // X-Request-Id) is the host's own 404/5xx page: the API is simply not there.
  const contentType = res.headers.get('Content-Type') || '';
  const fromGateway = res.headers.has('X-Request-Id');
  if (contentType.includes('text/html') || isGatewayDown(res.status) || (!res.ok && !fromGateway)) {
    throw offlineError();
  }

  const text = await res.text();
  if (import.meta.env.DEV) {
    // Dev-only timing in the browser console; the id matches the backend logs (grep for it).
    const ms = Math.round(performance.now() - started);
    const id = res.headers.get('X-Request-Id') || '-';
    const style = res.ok ? (ms > 1000 ? 'color:#b45309' : 'color:#15803d') : 'color:#b91c1c';
    console.debug(`%c[api] ${upper} ${path} -> ${res.status} in ${ms} ms  (request ${id})`, style);
  }
  let data = text;
  try { data = text ? JSON.parse(text) : null; } catch { /* plain text */ }

  if (!res.ok) {
    if (res.status === 401) onUnauthorized();
    throw new ApiError(messageFor(res.status, data), res.status, data?.fieldErrors || {});
  }
  return data;
}

/**
 * Starts the OAuth2 authorization-code login at the gateway, which redirects back to /callback.
 * idp='google' asks the authorization server to skip its login page and go straight to Google.
 */
export function redirectToLogin(idp) {
  const params = new URLSearchParams();
  if (idp === 'google') params.set('idp', 'google');
  // The sign-in page lives on the auth server (another origin), so tell it which theme we're in.
  params.set('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
  window.location.assign(`/oauth2/authorization/openjar-client?${params}`);
}

/**
 * Logout must be a real top-level navigation (not fetch): the gateway redirects to the
 * authorization server to end that session too, then back to the app.
 */
export async function submitLogout() {
  const token = await getCsrfToken();
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = '/logout';
  const input = document.createElement('input');
  input.type = 'hidden';
  input.name = '_csrf';
  input.value = token || '';
  form.appendChild(input);
  document.body.appendChild(form);
  form.submit();
}
