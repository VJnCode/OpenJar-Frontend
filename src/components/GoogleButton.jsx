import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function GoogleLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/>
    </svg>
  );
}

/**
 * "Continue with Google". Always visible; disabled with an explanation until the server
 * has Google sign-in configured (GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET).
 */
export default function GoogleButton({ label = 'Continue with Google', className = '' }) {
  const { authOptions, loginWithGoogle, serverOnline } = useAuth();
  const [busy, setBusy] = useState(false);
  const enabled = Boolean(authOptions?.google);

  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => { setBusy(true); loginWithGoogle(); }}
        disabled={!enabled || busy}
        aria-describedby={enabled ? undefined : 'google-unavailable'}
        title={enabled ? undefined : 'Google sign-in is not configured on the server yet'}
        className="w-full py-3 px-4 bg-surface border-[1.5px] border-line rounded-xl text-sm font-semibold text-ink
          flex items-center justify-center gap-3 shadow-sm transition-all duration-200
          enabled:hover:shadow-md enabled:hover:-translate-y-px enabled:hover:border-muted/40 enabled:active:translate-y-0
          disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <GoogleLogo />
        {busy ? 'Redirecting to Google…' : label}
      </button>
      {!enabled && serverOnline !== false && (
        <p id="google-unavailable" className="text-[11px] text-muted text-center mt-1.5">
          Google sign-in isn't enabled on this server yet. Use email for now.
        </p>
      )}
    </div>
  );
}
