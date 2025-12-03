import React, { createContext, useState, useEffect, ReactNode } from "react";
import * as auth from "../services/auth.service";

type User = { id: string; email: string; isAdmin?: boolean } | null;

type Context = {
  user: User;
  loading: boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (payload: {
    email: string;
    password: string;
    name?: string;
  }) => Promise<any>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<Context>({
  user: null,
  loading: true,
  login: async () => ({}),
  register: async () => ({}),
  logout: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    auth
      .me()
      .then((data: any) => setUser(data.user ?? data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const res = await auth.login({ email, password });
    const u = res.user ?? res;
    setUser(u);
    return res;
  };

  const register = async (payload: {
    email: string;
    password: string;
    name?: string;
  }) => {
    const res = await auth.register(payload);
    const u = res.user ?? res;
    setUser(u);
    return res;
  };

  const logout = async () => {
    await auth.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
