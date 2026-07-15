import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import AuthService, {
  type User,
  type LoginCredentials,
  type RegisterData,
} from "@/services/authService";
import toast from "react-hot-toast";
import authService from "@/services/authService";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<User>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const refreshUser = async () => {
    const profile = await authService.getProfile();

    setUser(profile);
  };
  useEffect(() => {
    try {
      if (AuthService.isAuthenticated()) {
        const storedUser = AuthService.getCurrentUser();
        if (storedUser) {
          setUser(storedUser);
        }
      }
    } catch (error) {
      console.error("Authentication initialization failed:", error);
      AuthService.logout();
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      const response =
        await AuthService.login(credentials);

      setUser(response.user);

      return response.user;
    },
    []
  );

  const register = useCallback(async (data: RegisterData) => {
    await AuthService.register(data);

    toast.success("Registration successful. Please login.");
  }, []);

  const logout = useCallback(() => {
    AuthService.logout();
    setUser(null);
    toast.success("Logged out successfully");
  }, []);

  const updateUser = useCallback((data: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;

      const updated = {
        ...prev,
        ...data,
      };

      localStorage.setItem("user", JSON.stringify(updated));

      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateUser,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within an AuthProvider"
    );
  }

  return context;
}