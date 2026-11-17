import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function CallbackPage() {
  const navigate = useNavigate();
  const { refresh } = useAuth();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;   // StrictMode runs effects twice in development
    ran.current = true;
    // The gateway already exchanged the authorization code and set the HttpOnly session cookie.
    refresh().then(u => navigate(u ? '/home' : '/login?error', { replace: true }));
  }, [refresh, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-canvas">
      <div className="w-12 h-12 border-4 border-brand border-t-transparent rounded-full animate-spin" />
      <p className="text-muted font-medium">Signing you in…</p>
    </div>
  );
}
