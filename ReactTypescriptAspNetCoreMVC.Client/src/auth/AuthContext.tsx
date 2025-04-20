import { createContext, useState, useEffect, ReactNode } from 'react';

type AuthContextType = {
  token: string | null;
  user: string | null; // you can use a more complex type if needed
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
};

export const AuthContext = createContext<AuthContextType>({
  token: null,
  user: null,
  login: () => { },
  logout: () => { },
  isAuthenticated: false,
  loading: false
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      const payload = parseJwt(savedToken);
      setUser(payload?.sub || null);
    }
    setLoading(false);
  }, []);

  const login = (token: string) => {
    localStorage.setItem('token', token);
    setToken(token);
    const payload = parseJwt(token);
    setUser(payload?.sub || null);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Simple JWT parser
function parseJwt(token: string): any | null {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
}