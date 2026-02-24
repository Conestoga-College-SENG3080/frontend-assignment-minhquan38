"use client";

import { useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode";
import { User } from "@/types/user";
import { Post } from "@/types/post";
import {Forum} from "@/types/forum"
import { login, fetchForums, fetchPostBySlug } from "@/lib/apiRequests";
import { saveAuth, getStoredUser} from "@/lib/userInfoStorage";

type JWTPayload = { exp?: number; [key: string]: any };

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Forum inputs
  const [forums, setForums] = useState<Forum[]>([]);
  const [selectedSlug, setSelectedSlug] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);

  /* =========================
     JWT Validation
  ========================== */
  const isTokenValid = (t: string | null) => {
    if (!t) return false;
    try {
      const payload = jwtDecode<JWTPayload>(t);
      if (!payload.exp) return false;
      return Date.now() / 1000 < payload.exp;
    } catch {
      return false;
    }
  };

 /* =========================
     Authentication
  ========================== */
  const authenticate = async () => {
    const storedToken = localStorage.getItem("token");
    console.log(storedToken);

    if (!isTokenValid(storedToken)) {
      try {
        const data = await login("vkhuong2363", "8822363"); 
        saveAuth(data.access_token, data.user);
        setUser(data.user);
        setToken(data.access_token);
      } 
      catch (err) {
        console.error("Failed to authenticate:", err);
      }
    } 
    else {
      setToken(storedToken);
      const storedUser = getStoredUser();
      setUser(storedUser);
    }
  };

  useEffect(() => {
    authenticate();
  }, []);

    /* =========================
     Load Forums After Auth
  ========================== */
  useEffect(() => {
    if (!token) return;

    const loadForums = async () => {
    try {
      const data: Forum[] = await fetchForums(token);
      setForums(data);
    } 
    catch (err) {
      console.error("Failed to load forums:", err);
    }
    };

    loadForums();
  }, [token]);

   /* =========================
     Load Posts When Forum Selected
  ========================== */

  useEffect(() => {
    if (!selectedSlug || !token) return;

    const loadPosts = async () => {
      try {
        const data: Post[] = await fetchPostBySlug(token,selectedSlug);
        setPosts(data);
      } 
      catch (err) {
        console.error("Failed to load posts:", err);
      } 
    };

    loadPosts();
  }, [selectedSlug]);

  return (
    <div style={{ padding: 20 }}>
      <h1>Main Page</h1>

      {user ? (<h2> Welcome {user.firstName} {user.lastName}</h2>) : (<h2>Authenticating...</h2>)}

      {/* Forum Dropdown */}
      <div style={{ marginBottom: 20 }}>
        <select
          value={selectedSlug}
          onChange={(e) => setSelectedSlug(e.target.value)}>
          <option value="">Select a forum</option>
          {/* Add the fetched forums from /forums as the options for this dropdown */}
          {forums.map((forum) => (
            <option key={forum.id} value={forum.slug}>
              {forum.slug}
            </option>
          ))}
        </select>
      </div>

      {/* Show a list of 10 post based on the chosen forum */}
      {posts.map((post) => {
      return (
          <div
            key={post.id}
            style={{
              background: "white",
              padding: 20,
              borderRadius: 8,
              marginTop: 20,
              boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
            }}
          >
            <h3>{post.title}</h3>
            <p style={{ color: "#555" }}>
              {post.content}
            </p>

            <div style={{ fontSize: 12, color: "#999" }}>
              Author: {post.author} | Likes: {post.totalLikes} | Read: {post.totalRead}
            </div>
          </div>
        );
      })}
    </div>
  );
}