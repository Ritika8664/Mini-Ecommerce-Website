import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { api } from "@/lib/api";
import type { User } from "@/types";

interface AuthContextValue {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (googleCredential: string) => Promise<User>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function getStoredUser(): User | null {
  try {
    const stored = localStorage.getItem("auth_user");
    return stored ? (JSON.parse(stored) as User) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("auth_token"),
  );
  const [user, setUser] = useState<User | null>(getStoredUser);
  const [isLoading, setIsLoading] = useState(Boolean(token));

  const clearSession = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
  }, []);

  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }
    let active = true;
    setIsLoading(true);
    api
      .getMe()
      .then((profile) => {
        if (!active) return;
        setUser(profile);
        localStorage.setItem("auth_user", JSON.stringify(profile));
      })
      .catch(() => active && clearSession())
      .finally(() => active && setIsLoading(false));
    return () => {
      active = false;
    };
  }, [clearSession, token]);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token && user),
      isLoading,
      login: async (googleCredential) => {
        const session = await api.googleLogin(googleCredential);
        localStorage.setItem("auth_token", session.access_token);
        localStorage.setItem("auth_user", JSON.stringify(session.user));
        setUser(session.user);
        setToken(session.access_token);
        return session.user;
      },
      logout: async () => {
        try {
          if (token) await api.logout();
        } finally {
          clearSession();
        }
      },
    }),
    [clearSession, isLoading, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
