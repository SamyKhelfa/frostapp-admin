import { useLoginMutation } from "@core/api";
import { ILoginPayload, IUser } from "@core/interfaces";
import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

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

  const [loginMutation, { isLoading: isLogging }] = useLoginMutation();

  const handleLogin = async ({ email, password }: ILoginPayload) => {
    try {
      const { authToken, user } = await loginMutation({ email, password }).unwrap();

      localStorage.setItem("auth-token", authToken);

      setUser(user);
    } catch (error) {
      console.error(error);
    }
  };

  const value = useMemo(() => {
    return {
      user,
      isLogging,
      handleLogin,  
    }
  }, [isLogging, user])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => {
  return useContext(AuthContext);
};