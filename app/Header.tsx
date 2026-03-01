"use client";

import Link from "next/link";
import { useAuth } from "./AuthContext";

export default function Header() {
  const { user } = useAuth();

  return (
    <div className="navbar">
      <div className="header">
        <div className="col-1">
          <div className="menu">
            <div>
              <Link href="/">Home</Link>
            </div>
            <div>
              <Link href="/favorites">Favorite posts</Link>
            </div>
          </div>
        </div>
        <div className="user-info">
          {user ? (
            <span>Welcome, {user.firstName} {user.lastName}</span>
          ) : (
            <span>Loading...</span>
          )}
        </div>
      </div>
    </div>
  );
}
