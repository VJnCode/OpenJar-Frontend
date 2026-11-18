import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { apiFetch, redirectToLogin, setUnauthorizedHandler, submitLogout } from '../api/client';
import { getCurrentUser } from '../services/userService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  // Which sign-in methods the server offers (Google only when configured).
  const [authOptions, setAuthOptions] = useState({ google: false });
  // null = not known yet, true = API answered, false = no API server reachable.
  const [serverOnline, setServerOnline] = useState(null);

  /** Asks the gateway who is logged in (via the HttpOnly session cookie). */
  const refresh = useCallback(async () => {
    try {
      const me = await getCurrentUser();
      // Only a real user object counts as a session.
      const valid = me && typeof me === 'object' && me.userId != null ? me : null;
      setUser(valid);
      setServerOnline(true);
      return valid;
    } catch (err) {
      setUser(null);
      setServerOnline(!err?.offline);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    // If any API call comes back 401, the session has expired: reflect that in the UI.
    setUnauthorizedHandler(() => setUser(null));
    apiFetch('/api/users/auth-options')
      .then(opts => setAuthOptions({ google: opts?.google === true }))
      .catch(() => {});
  }, [refresh]);

  // Sign-in is a full-page redirect to the gateway; without a server it would land on a 404.
  const value = useMemo(() => ({
    user,
    setUser,
    loading,
    refresh,
    authOptions,
    serverOnline,
    login: () => { if (serverOnline !== false) redirectToLogin(); },
    loginWithGoogle: () => { if (serverOnline !== false) redirectToLogin('google'); },
    logout: submitLogout,
  }), [user, loading, refresh, authOptions, serverOnline]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
