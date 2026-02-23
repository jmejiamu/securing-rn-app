import * as SecureStore from "expo-secure-store";

const ACCESS_KEY = "access_token";
const REFRESH_KEY = "refresh_token";
const API_URL = "http://localhost:4000";

export type Tokens = { accessToken: string; refreshToken: string };

export const tokenStorage = {
  getAccess: () => SecureStore.getItemAsync(ACCESS_KEY),
  getRefresh: () => SecureStore.getItemAsync(REFRESH_KEY),

  async set(tokens: Tokens) {
    await SecureStore.setItemAsync(ACCESS_KEY, tokens.accessToken);
    await SecureStore.setItemAsync(REFRESH_KEY, tokens.refreshToken);
  },

  async clear() {
    await SecureStore.deleteItemAsync(ACCESS_KEY);
    await SecureStore.deleteItemAsync(REFRESH_KEY);
  },
};

export const apiFetch = async (
  url: string,
  options: RequestInit = {},
  retryOn401 = true,
) => {
  const accessToken = await tokenStorage.getAccess();
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${accessToken}`,
  };
  const fullUrl = url.startsWith("http") ? url : `${API_URL}${url}`;

  try {
    const response = await fetch(fullUrl, { ...options, headers });
    if (response.status === 401 && retryOn401) {
      // Attempt refresh
      const refreshSuccess = await refreshToken();
      if (refreshSuccess) {
        console.log("Token refreshed, retrying original request...");
        // Retry the original request with the new token
        const newToken = await tokenStorage.getAccess();
        const newHeaders = {
          ...options.headers,
          Authorization: `Bearer ${newToken}`,
        };
        return await fetch(`${API_URL}${url}`, {
          ...options,
          headers: newHeaders,
        });
      } else {
        // Refresh failed, logout
        await tokenStorage.clear();
        // Optionally navigate to login (use a navigation ref if needed)
        return;
      }
    }
    return response;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

// Helper to refresh token
const refreshToken = async (): Promise<boolean> => {
  const refreshToken = await tokenStorage.getRefresh();
  try {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${refreshToken}`, // Or send refresh token if available
      },
      body: JSON.stringify({ refreshToken }),
    });
    if (response.ok) {
      const data = await response.json();
      await tokenStorage.set({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });
      return true;
    }
    return false;
  } catch (error) {
    console.error("Refresh failed:", error);
    return false;
  }
};
