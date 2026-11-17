import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { apiFetch, redirectToLogin, setUnauthorizedHandler, submitLogout } from '../api/client';
import { getCurrentUser } from '../services/userService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  // Which sign-in methods the server offers (Google only when configured).
  const [authOptions, setAuthOptions] = useState({ google: false });

  /** Asks the gateway who is logged in (via the HttpOnly session cookie). */
  const refresh = useCallback(async () => {
    try {
      const me = await getCurrentUser();
      setUser(me);
      return me;
    } catch {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    // If any API call comes back 401, the session has expired: reflect that in the UI.
    setUnauthorizedHandler(() => setUser(null));
    apiFetch('/api/users/auth-options').then(setAuthOptions).catch(() => {});
  }, [refresh]);

  const value = useMemo(() => ({
    user,
    setUser,
    loading,
    refresh,
    authOptions,
    login: () => redirectToLogin(),
    loginWithGoogle: () => redirectToLogin('google'),
    logout: submitLogout,
  }), [user, loading, refresh, authOptions]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
