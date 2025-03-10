import {
  createContext,
  useContext,
  useState,
  useEffect,
  SetStateAction,
  Dispatch,
} from "react";
import { apiFetch } from "../utils/utils";
import toast from "react-hot-toast";

type User = {
  id: string;
  username: string;
  email: string;
  avatar?: string;
};

type AuthContextType = {
  user?: User;
  login: (email: string, password: string) => Promise<any>;
  setUser: Dispatch<SetStateAction<User | undefined>>;
  signup: (formData: FormData) => Promise<any>;
  logout: () => Promise<any>;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  activeUsers: number;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | undefined>();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeUsers, setActiveUsers] = useState<number>(0);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const sessionResponse = await checkSession();
        if (sessionResponse.success) {
          setUser(sessionResponse.data.user);
        } else {
          const refreshResponse = await refreshToken();
          if (refreshResponse.success) {
            setUser(refreshResponse.data.user);
          } else {
            toast.error("Session expired, Login again");
          }
        }
      } catch (error) {
        setUser(undefined);
        toast.error("Internal server error");
      }
    };

    initializeAuth();
  }, []);

  useEffect(() => {
    if (user) {
      getActiveUsers();
    }
  }, [user]);

  const getActiveUsers = async () => {
    try {
      const response = await apiFetch("/auth/get-active-users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.success) {
        setActiveUsers(response.data);
      } else {
        setActiveUsers(0);
      }
    } catch (error: any) {
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await apiFetch("/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      return response;
    } catch (error: any) {
      throw error;
    }
  };

  const signup = async (formData: FormData) => {
    try {
      const response = await apiFetch("/auth/signup", {
        method: "POST",
        body: formData,
      });
      return response;
    } catch (error: any) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      const response = await apiFetch("/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.success) {
        setUser(undefined);
        setIsOpen(false);
      }
      return response;
    } catch (error: any) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, login, setUser, signup, logout, isOpen, setIsOpen, activeUsers }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

const checkSession = async () => {
  try {
    const response = await apiFetch("/auth/check-session", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error: any) {
    throw error;
  }
};

const refreshToken = async () => {
  try {
    const response = await apiFetch("/auth/refresh-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error: any) {
    throw error;
  }
};