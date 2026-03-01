"use client";

import { useEffect, useState } from "react";
import { Post } from "@/models/post";
import { Forum } from "@/models/forum";
import { fetchForums, fetchPostBySlug } from "@/lib/apiRequests";
import { toggleFavorite, getFavorites } from "@/lib/localStorage";
import { useAuth } from "./AuthContext";
import PostList from "./components/PostList";

export default function Home() {
  const { token } = useAuth();

  // Forum inputs
  const [forums, setForums] = useState<Forum[]>([]);
  const [selectedSlug, setSelectedSlug] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  /* =========================
     Load Forums After Auth
  ========================== */
  useEffect(() => {
    if (!token) return;
    console.log(token);
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
  }, [selectedSlug, token]);

  useEffect(() => {
  setFavorites(getFavorites());
}, []);

const handleToggleFavorite = (postId: string) => {
  const updated = toggleFavorite(postId);
  setFavorites(updated);
};
  

  return (
    <div style={{ padding: 20 }}>
      <h1><b>Posts</b></h1>
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
      <PostList
        posts={posts}
        favorites={favorites}
        onToggleFavorite={handleToggleFavorite}
      />
    </div>
  );
}