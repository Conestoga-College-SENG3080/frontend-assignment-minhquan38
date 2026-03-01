"use client";

import { useEffect, useState } from "react";
import { Post } from "@/models/post";
import { fetchPostByID } from "@/lib/apiRequests";
import { getFavorites, toggleFavorite } from "@/lib/localStorage";
import { useAuth } from "../AuthContext";
import PostList from "../components/PostList";

export default function FavoritesPage() {
  const { token } = useAuth();
  const [favoritePosts, setFavoritePosts] = useState<Post[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    if (!token) return;

    const loadFavoritePosts = async () => {
      try {
        const favoriteIds = getFavorites();
        setFavorites(favoriteIds);
        if (favoriteIds.length === 0) {
          setFavoritePosts([]);
          return;
        }

        const results = await Promise.allSettled(
          favoriteIds.map((postId) => fetchPostByID(token, postId))
        );

        const onlyFavorites = results
          .filter((result): result is PromiseFulfilledResult<Post> => result.status === "fulfilled")
          .map((result) => result.value);

        setFavoritePosts(onlyFavorites);
      } catch (err) {
        console.error("Failed to load favorite posts:", err);
      } 
    };

    loadFavoritePosts();
  }, [token]);

  const handleRemoveFavorite = (postId: string) => {
    const updated = toggleFavorite(postId);
    setFavorites(updated);
    setFavoritePosts((prev) => prev.filter((post) => updated.includes(post.id)));
  };

  return (
    <div style={{ padding: 20 }}>
      <h1><b>Favorite Posts</b></h1>

      <PostList
        posts={favoritePosts}
        favorites={favorites}
        onToggleFavorite={handleRemoveFavorite}
        emptyMessage="No favorite posts found."
      />
    </div>
  );
}