import { useState, ReactNode, useEffect } from "react";
import {
  getAccessToken,
  getRefreshToken,
  getExpiry,
  setToken,
  removeToken,
} from "@/lib/storage";
import { AuthContext, User } from "./AuthContext";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(
    getAccessToken()
  );
  const [refreshToken, setRefreshToken] = useState<string | null>(
    getRefreshToken()
  );
  const [expiresAt, setExpiresAt] = useState<number | null>(getExpiry());

  const isSignedIn = !!accessToken;

  useEffect(() => {
    if (accessToken) {
      setUser({
        id: "123",
        name: "John Doe",
        email: "johndoe@example.com",
      });
    }
  }, [accessToken]);

  const signIn = (newAccess: string, newRefresh: string, newExpiry: number) => {
    setAccessToken(newAccess);
    setRefreshToken(newRefresh);
    setExpiresAt(newExpiry);
    setToken(newAccess, newRefresh, newExpiry);
  };

  const signOut = () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    setExpiresAt(null);
    removeToken();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        refreshToken,
        expiresAt,
        isSignedIn,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
