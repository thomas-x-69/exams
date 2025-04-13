// context/AuthContext.js
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import {
  auth,
  getUserProfile,
  loginWithUsernameAndPassword,
  registerUser,
  logoutUser,
} from "../lib/firebase";

// Auth context
const AuthContext = createContext({
  user: null,
  userProfile: null,
  loading: true,
  error: null,
  isPremium: false,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  setError: () => {},
  clearError: () => {},
});

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPremium, setIsPremium] = useState(false);

  // Clear error
  const clearError = () => setError(null);

  // Listen for auth state changes
  useEffect(() => {
    if (!auth) return () => {};

    setLoading(true);

    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      try {
        if (authUser) {
          // User is logged in
          setUser(authUser);

          // Get user profile
          const profile = await getUserProfile(authUser.uid);
          if (profile) {
            setUserProfile(profile);

            // Check premium status
            if (profile.isPremium === true) {
              setIsPremium(true);
            }
          }
        } else {
          // User is logged out
          setUser(null);
          setUserProfile(null);
          setIsPremium(false);
        }
      } catch (err) {
        console.error("Auth state change error:", err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Login function
  const login = async (username, password) => {
    try {
      clearError();
      setLoading(true);

      const result = await loginWithUsernameAndPassword(username, password);

      if (result.success) {
        setUser(result.user);
        setUserProfile(result.userData);
        if (result.userData?.isPremium) {
          setIsPremium(true);
        }
        return { success: true, user: result.userData };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      console.error("Login error:", err);
      const errorMessage = err.message || "حدث خطأ أثناء تسجيل الدخول";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      clearError();
      setLoading(true);

      const result = await registerUser(userData);

      if (result.success) {
        setUser(result.user);
        setUserProfile(result.userData);
        return { success: true, user: result.userData };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      console.error("Registration error:", err);
      const errorMessage = err.message || "حدث خطأ أثناء إنشاء الحساب";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      clearError();
      setLoading(true);

      const result = await logoutUser();

      if (result.success) {
        setUser(null);
        setUserProfile(null);
        setIsPremium(false);
        return true;
      } else {
        setError(result.error);
        return false;
      }
    } catch (err) {
      console.error("Logout error:", err);
      setError(err.message || "حدث خطأ أثناء تسجيل الخروج");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Context value
  const value = {
    user,
    userProfile,
    loading,
    error,
    isPremium,
    login,
    register,
    logout,
    setError,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
