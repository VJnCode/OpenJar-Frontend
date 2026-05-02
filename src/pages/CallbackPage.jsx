import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../api/client';

export default function CallbackPage() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    // Gateway has already handled the OAuth2 code exchange and set the session cookie.
    // We just need to fetch the current authenticated user.
    apiFetch('/api/users/me')
      .then(u => { setUser(u); navigate('/home'); })
      .catch(() => navigate('/login'));
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-orange-50 to-stone-50">
      <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-stone-600 font-medium">Signing you in…</p>
    </div>
  );
}
