"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useMutation } from "@tanstack/react-query";
import { LoginCredentials, userLogin } from "@/services/auth";
import { getEnterprise } from "@/services/enterprise";

interface AuthContextType {
  isLoggedIn: boolean;
  login: (payload: LoginCredentials) => void;
  logout: () => void;
  isPending: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("token");
    setIsLoggedIn(!!token);
  }, []);

  const { mutate, isPending } = useMutation({
    mutationKey: ["login"],
    mutationFn: (payload: LoginCredentials) => userLogin(payload),
    onSuccess: async (data) => {
      if (data.status === 200) {
        Cookies.set("token", data?.token || "");
        setIsLoggedIn(true);
        router.push("/dashboard");
      }
    },
    onError: (error) => {
      console.error("Login error:", error.message);
    },
  });

  const login = (payload: LoginCredentials) => {
    mutate(payload);
  };

  const logout = () => {
    Cookies.remove("token");
    Cookies.remove("enterpriseConfigs");
    setIsLoggedIn(false);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, isPending }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
