import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

const MOCK_USER = {
  userId: '1',
  userName: 'Chef Mario',
  userEmail: 'mario@openjar.com',
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(MOCK_USER);

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, setUser, loading: false, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
