"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@/types/user";
import { login } from "@/lib/apiRequests";
import { saveAuth} from "@/lib/localStorage";

type AuthContextType = {
  user: User | null;
  token: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const authenticate = async () => {
    try {
      const data = await login("vkhuong2363", "8822363");
      saveAuth(data.access_token);
      setUser(data.user);
      setToken(data.access_token);
    } 
    catch (err) {
      console.error("Failed to authenticate:", err);
    }
    
  };

  useEffect(() => {
    authenticate();
  }, []);

  return (
    <AuthContext.Provider value={{ user, token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
