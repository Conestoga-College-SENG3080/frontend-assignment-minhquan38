import { User } from "@/types/user";

export function saveAuth(token: string, user: User) {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
}

export function getStoredUser(): User | null {
  const storedUser = localStorage.getItem("user");
  return storedUser ? JSON.parse(storedUser) : null;
}

export function clearAuth() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}