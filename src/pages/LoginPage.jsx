import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthShowcase from '../components/AuthShowcase';
import GoogleButton from '../components/GoogleButton';
import usePageTitle from '../hooks/usePageTitle';
import Logo from '../components/Logo';

function greeting() {
  const h = new Date().getHours();
  if (h < 5)  return 'Late-night craving? 🌙';
  if (h < 12) return 'Good morning, chef ☀️';
  if (h < 17) return 'Good afternoon, chef 🍋';
  return 'Good evening, chef 🍷';
}

const PERKS = [
  { emoji: '📖', text: 'Save and share your own recipes' },
  { emoji: '❤️', text: 'Like and comment on dishes you love' },
  { emoji: '🔔', text: 'Get an email when someone likes or comments' },
];

export default function LoginPage() {
  usePageTitle('Sign in');
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [busy, setBusy] = useState(false);
  const failed = params.has('error');

  useEffect(() => {
    if (user) navigate('/home', { replace: true });
  }, [user, navigate]);

  return (
    <div className="flex-1 flex bg-canvas min-h-[calc(100vh-68px)]">
      <AuthShowcase />

      <div className="flex-1 flex items-center justify-center px-6 py-14 relative overflow-hidden">
        <div className="absolute -top-24 -right-32 w-96 h-96 rounded-full bg-[radial-gradient(circle,#fbeae5_0%,transparent_70%)] pointer-events-none" />

        <div className="w-full max-w-sm relative animate-fade-up">
          <div className="flex justify-center lg:hidden mb-8"><Logo variant="full" size={150} /></div>
          <p className="text-xs font-bold text-brand tracking-[0.14em] uppercase mb-2">{greeting()}</p>
          <h1 className="font-display text-4xl font-bold text-ink leading-tight mb-3">Sign in to your kitchen</h1>
          <p className="text-muted mb-8 leading-relaxed">
            Pick up where you left off: your recipes, likes and conversations are waiting.
          </p>

          {failed && (
            <div role="alert" className="flex gap-2.5 items-start text-sm text-danger bg-danger-soft rounded-xl px-4 py-3 mb-6">
              <span>⚠️</span><span>Sign-in didn't complete. Please try again.</span>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <GoogleButton />
            <div className="flex items-center gap-3 my-2 text-xs text-muted">
              <div className="flex-1 h-px bg-line" /> or <div className="flex-1 h-px bg-line" />
            </div>
            <button
              onClick={() => { setBusy(true); login(); }}
              disabled={busy}
              className="group w-full py-3.5 bg-brand text-white text-[15px] font-bold rounded-xl hover:bg-brand-dark active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2.5 shadow-lg shadow-brand/30 disabled:opacity-75"
            >
              {busy ? (
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.9 5.3a2 2 0 002.2 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              )}
              {busy ? 'Taking you to sign in…' : 'Continue with email'}
              {!busy && <span className="transition-transform group-hover:translate-x-1">→</span>}
            </button>
          </div>

          <ul className="mt-9 flex flex-col gap-3">
            {PERKS.map(p => (
              <li key={p.text} className="flex items-center gap-3 text-sm text-ink/75">
                <span className="w-8 h-8 rounded-lg bg-brand-soft flex items-center justify-center">{p.emoji}</span>
                {p.text}
              </li>
            ))}
          </ul>

          <div className="mt-9 text-sm text-muted text-center flex flex-col gap-2">
            <span>New to OpenJar? <Link to="/register" className="text-brand font-semibold hover:underline">Create a free account</Link></span>
            <span>Registered but not verified? <Link to="/verify" className="text-brand font-semibold hover:underline">Enter your code</Link></span>
          </div>

          <p className="mt-8 flex items-center justify-center gap-2 text-xs text-muted">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
              <rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 118 0v4" />
            </svg>
            Secured with OAuth 2.0 · we never see your Google password
          </p>
        </div>
      </div>
    </div>
  );
}
