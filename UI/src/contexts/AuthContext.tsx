import { createContext, useContext } from "react";
import { useGetCurrentUser } from "../_services/auth.service";

interface CurrentUser {
  name: string;
  space: string;
  email: string;
}

interface AuthProviderProps {
  isAuthenticated: boolean;
  user: CurrentUser | undefined;
  isLoading: boolean;
  isError: boolean;
}

const AuthContext = createContext<AuthProviderProps | null>(null);

export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: user, isLoading, isError } = useGetCurrentUser();

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        isLoading,
        isError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }
  return context;
};
