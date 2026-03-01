"use client";

import { Post } from "@/models/post";

type PostListParameters = {
  posts: Post[];
  favorites: string[];
  onToggleFavorite: (postId: string) => void;
  emptyMessage?: string;
};

export default function PostList({
  posts,
  favorites,
  onToggleFavorite,
  emptyMessage,
}: PostListParameters) {
  if (posts.length === 0 && emptyMessage) {
    return <p>{emptyMessage}</p>;
  }

  return (
    <>
      {posts.map((post) => {
        const isFav = favorites.includes(post.id);
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
            <h2>
              <b>{post.title}</b>
            </h2>
            <p style={{ color: "#555" }}>{post.content}</p>

            <div style={{ fontSize: 12, color: "#999" }}>
              Author: {post.author} | Likes: {post.totalLikes} | Read: {post.totalRead}
            </div>

            <button
              onClick={() => onToggleFavorite(post.id)}
              style={{
                marginTop: 10,
                padding: "6px 12px",
                borderRadius: 6,
                border: "none",
                cursor: "pointer",
                background: isFav ? "#ff0202" : "#0074e7",
              }}
            >
              {isFav ? "Remove Favorite" : "Add Favorite"}
            </button>
          </div>
        );
      })}
    </>
  );
}