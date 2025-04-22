import { jwtDecode } from "jwt-decode";
import { createContext, useState, useEffect, ReactNode } from "react";

type AuthContextType = {
  token: string | null;
  user: string | null; // can use a more complex type if needed
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
  roles: string[];
};

export const AuthContext = createContext<AuthContextType>({
  token: null,
  user: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
  loading: false,
  roles: [],
});

interface JwtPayload {
  sub?: string;
  role?: string | string[];
  [key: string]: any;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthContextType>({
    isAuthenticated: false,
    user: null,
    token: null,
    roles: [],
    login: () => {},
    logout: () => {},
    loading: false,
  });

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      const decoded: JwtPayload = jwtDecode(savedToken);

      console.log("[AuthContext] Rehydrated decoded:", decoded);

      const username = decoded.sub || decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];

      const rawRoles =
        decoded.role ||
        decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
        decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role"];

      const roles = Array.isArray(rawRoles) ? rawRoles : rawRoles ? [rawRoles] : [];

      setAuthState({
        isAuthenticated: true,
        user: username ?? null,
        token: savedToken,
        roles,
        login,
        logout,
        loading: false,
      });
    } else {
      setAuthState({
        isAuthenticated: false,
        user: null,
        token: null,
        roles: [],
        login,
        logout,
        loading: false,
      });
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem("token", token);
    const decoded: JwtPayload = jwtDecode(token);

    const username = decoded.sub || decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];

    const rawRoles =
      decoded.role ||
      decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
      decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role"];

    const roles = Array.isArray(rawRoles) ? rawRoles : rawRoles ? [rawRoles] : [];

    setAuthState({
      isAuthenticated: true,
      user: username ?? null,
      token,
      roles,
      login,
      logout,
      loading: false,
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setAuthState({
      isAuthenticated: false,
      user: null,
      token: null,
      roles: [],
      login,
      logout,
      loading: false,
    });
  };

  return <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>;
};

// function parseJwt(token: string): any | null {
//   try {
//     return JSON.parse(atob(token.split(".")[1]));
//   } catch {
//     return null;
//   }
// }
