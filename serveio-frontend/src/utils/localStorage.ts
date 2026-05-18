import type { User } from "@/types/types";

const AUTH_STORAGE_KEY = "serveio_auth";

export interface StoredAuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
}

export const saveAuthToLocalStorage = (authState: StoredAuthState): void => {
  try {
    const serializedState = JSON.stringify(authState);
    localStorage.setItem(AUTH_STORAGE_KEY, serializedState);
  } catch (error) {
    console.error("Failed to save auth state to localStorage:", error);
  }
};

export const loadAuthFromLocalStorage = (): StoredAuthState | null => {
  try {
    const serializedState = localStorage.getItem(AUTH_STORAGE_KEY);
    if (serializedState === null) {
      return null;
    }
    return JSON.parse(serializedState);
  } catch (error) {
    console.error("Failed to load auth state from localStorage:", error);
    return null;
  }
};

export const clearAuthFromLocalStorage = (): void => {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear auth state from localStorage:", error);
  }
};
