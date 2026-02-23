"use client";

import { useEffect, useState } from "react";
import { User } from "@/types/user";
import { login } from "@/lib/apiRequests";
import { saveAuth, getStoredUser, clearAuth } from "@/lib/userInfoStorage";
import { jwtDecode } from "jwt-decode";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);

  type JWTPayload = {
  exp?: number;
  [key: string]: any; 
};

const isTokenValid = (token: string | null) => {
  if (!token) return false;

  try {
    const payload = jwtDecode<JWTPayload>(token);
    if (!payload.exp) return false;

    return Date.now() / 1000 < payload.exp;
  } catch {
    return false;
  }
};

  const authenticate = async () => {
    const storedToken = localStorage.getItem("token");
   
    
    if (!isTokenValid(storedToken)) {
      try {
        console.log("Call login API");

        const data = await login("vkhuong2363", "8822363");

        // Store new token & user
        saveAuth(data.access_token, data.user);
        setUser(data.user);
      } catch (error) {
        console.error("Failed to authenticate:", error);
      }
    } else {
      // Token exists and is valid
      const storedUser = getStoredUser();
      setUser(storedUser);
    }
  };

  useEffect(() => {
    authenticate();
  }, []);

  const handleClearStorage = () => {
    clearAuth();
    setUser(null);
  };

  return (
    <div>
      <h1>Main Page</h1>

      {user ? (
        <h2>
          Welcome {user.firstName} {user.lastName}
        </h2>
      ) : (
        <h2>Loading user info...</h2>
      )}

       <button onClick={handleClearStorage} style={{ marginTop: 20 }}>
        Clear Local Storage
      </button>
    </div>
  );
}