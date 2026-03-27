import { useLoginMutation, useMeQuery } from "@core/api";
import { i18n } from "@core/i18n/i18n";
import { ILoginPayload, IUser } from "@core/interfaces";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "react-toastify";

type RegisterPayload = { email: string; password: string; name: string };

type Context = {
  user: IUser | null;
  isLogging: boolean;
  handleLogin: (payload: ILoginPayload) => Promise<void>;
  handleLogout: () => void;
  register: (payload: RegisterPayload) => Promise<unknown>;
};

export const AuthContext = createContext<Context>({
  user: null,
  isLogging: true,
  handleLogin: async () => {},
  handleLogout: () => {},
  register: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null);

  const hasToken = !!localStorage.getItem("auth-token");
  const { data: userData, isLoading: isMeLoading, isSuccess: isMeSuccess } = useMeQuery(undefined, {
    skip: !hasToken,
  });

  const [loginMutation, { isLoading: isLogging }] = useLoginMutation();

  useEffect(() => {
    if (hasToken && isMeSuccess && userData) {
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    } else {
      setUser(null);
      localStorage.removeItem("user");
    }
  }, [isMeSuccess, userData, hasToken]);

  const handleLogin = async ({ email, password }: ILoginPayload) => {
    try {
      const { authToken, user: userResponse } = await loginMutation({ email, password }).unwrap();
      localStorage.setItem("auth-token", JSON.stringify(authToken));
      localStorage.setItem("user", JSON.stringify(userResponse));
      
      setUser(userResponse);
      toast.success(i18n.t("auth.toastLoginSuccess"));
    } catch (error) {
      console.error(error);
      toast.error(i18n.t("auth.toastLoginError"));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("auth-token");
    localStorage.removeItem("user");
    setUser(null);
    toast.success(i18n.t("auth.toastLogoutSuccess"));
  };

  const register = useCallback(async (_payload: RegisterPayload) => {
    throw new Error(i18n.t("register.notImplemented"));
  }, []);

  const value = useMemo(
    () => ({
      user: user,
      isLogging: isLogging || isMeLoading,
      handleLogin,
      handleLogout,
      register,
    }),
    [isLogging, isMeLoading, user, register]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => {
  return useContext(AuthContext);
};