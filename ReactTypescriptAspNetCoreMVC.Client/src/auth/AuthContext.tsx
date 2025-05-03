import { createContext, useState, useEffect, ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
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
  loading: true,
  roles: [],
});

interface JwtPayload {
  sub?: string;
  role?: string | string[];
  [key: string]: any;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserType | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (token: string) => {
    localStorage.setItem("token", token);
    setToken(token);

    const decoded: JwtPayload = jwtDecode(token);

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

    setUser(user);
    setRoles(roles);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setRoles([]);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      try {
        login(savedToken);
      } catch (error) {
        console.error("Failed to rehydrate token:", error);
        logout();
      }
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        login,
        logout,
        isAuthenticated,
        loading,
        roles,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
