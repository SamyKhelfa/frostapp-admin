import { useLoginMutation, useMeQuery } from "@core/api";
import { ILoginPayload, IUser } from "@core/interfaces";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type Context = {
  user: IUser | null;
  isLogging: boolean;
  handleLogin: (payload: ILoginPayload) => Promise<void>;
};

export const AuthContext = createContext<Context>({
  user: null,
  isLogging: true,
  handleLogin: async () => {}
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null);

  const hasToken = !!localStorage.getItem("auth-token");
  const { data: userData, isLoading: isMeLoading, isSuccess: isMeSuccess } = useMeQuery(undefined, {
    skip: !hasToken,
  });

  const [loginMutation, { isLoading: isLogging }] = useLoginMutation();

  useEffect(() => {
    if (isMeSuccess && userData) {
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
    } catch (error) {
      console.error(error);
    }
  };

  const value = useMemo(
    () => ({
      user: user,
      isLogging: isLogging || isMeLoading,
      handleLogin,
    }),
    [isLogging, isMeLoading, user]
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