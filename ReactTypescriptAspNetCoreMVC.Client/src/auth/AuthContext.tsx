import { jwtDecode } from "jwt-decode";
import { createContext, useState, useEffect, ReactNode } from "react";
import { UserType } from "../types/UserType";

type AuthContextType = {
  token: string | null;
  user: UserType | null;
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

      const user: UserType = {
        id: decoded.sub as string,
        username: (decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] as string) || "",
        email: (decoded["email"] as string) || "",
        displayName: (decoded["displayName"] as string) || "",
        firstName: (decoded["given_name"] as string) || "",
        lastName: (decoded["family_name"] as string) || "",
      };

      const rawRoles =
        decoded.role ||
        decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
        decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role"];

      const roles = Array.isArray(rawRoles) ? rawRoles : rawRoles ? [rawRoles] : [];

      setAuthState({
        isAuthenticated: true,
        user: user ?? null,
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

    const user: UserType = {
      id: decoded.sub as string,
      username: (decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] as string) || "",
      email: (decoded["email"] as string) || "",
      displayName: (decoded["displayName"] as string) || "",
      firstName: (decoded["given_name"] as string) || "",
      lastName: (decoded["family_name"] as string) || "",
    };

    localStorage.setItem("user", JSON.stringify(user));

    const rawRoles =
      decoded.role ||
      decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
      decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role"];

    const roles = Array.isArray(rawRoles) ? rawRoles : rawRoles ? [rawRoles] : [];

    setAuthState({
      isAuthenticated: true,
      user: user ?? null,
      token,
      roles,
      login,
      logout,
      loading: false,
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
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
