import { User } from "@/types/user";

const TOKEN_KEY = "token";
const USER_KEY = "user";
const FAVORITES_KEY = "favorites";

export function saveAuth(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

// Post favorite

export function getFavorites(): string[] {
  const stored = localStorage.getItem(FAVORITES_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveFavorites(ids: string[]) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
}

export function toggleFavorite(postId: string): string[] {
  const current = getFavorites();

  let updated: string[];
  if (current.includes(postId)) {
    //If the postID is already in the current list, remove it from the list
    updated = current.filter(function (id) {
      return id !== postId;
    });
  } 
  else {
    // If the postID is NOT in the list, add it to the list
    updated = [...current, postId];
  }

  // Finally save the update list of what is added and remove
  saveFavorites(updated);
  return updated; 
}

function isFavorite(postId: string): boolean {
  return getFavorites().includes(postId);
}