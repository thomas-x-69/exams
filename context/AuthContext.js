// context/AuthContext.js
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import {
  auth,
  getUserProfile,
  loginWithUsernameAndPassword,
  registerUser,
  updateUserProfile,
  setPremiumStatus,
  checkPremiumStatus,
  logoutUser,
  checkAuthSession,
} from "../lib/firebase";

// Create auth context with default values
const AuthContext = createContext({
  user: null,
  userProfile: null,
  loading: true,
  error: null,
  isPremium: false,
  premiumExpiryDate: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  updateProfile: async () => {},
  activatePremium: async () => {},
  checkPremiumStatus: async () => {},
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
  const [premiumExpiryDate, setPremiumExpiryDate] = useState(null);

  // Clear error helper
  const clearError = () => setError(null);

  // Initialize session from client storage on mount
  useEffect(() => {
    const initializeFromSession = async () => {
      setLoading(true);

      try {
        // First try to get user from session (fast)
        const sessionUser = checkAuthSession();

        if (sessionUser) {
          console.log("Restored session from localStorage");
          setUser(sessionUser);

          // Get the full profile (may use cache)
          const profile = await getUserProfile(sessionUser.uid);
          if (profile) {
            setUserProfile(profile);
          }

          // Check premium status (uses localStorage first)
          const premiumStatus = await checkPremiumStatus(sessionUser.uid);
          setIsPremium(premiumStatus.isPremium);
          if (premiumStatus.isPremium) {
            setPremiumExpiryDate(premiumStatus.expiryDate);
          }

          setLoading(false);
          return; // We've restored state, no need to wait for Firebase
        }

        // Check premium status without user (for non-logged in premium users)
        const premiumStatus = await checkPremiumStatus();
        setIsPremium(premiumStatus.isPremium);
        if (premiumStatus.isPremium) {
          setPremiumExpiryDate(premiumStatus.expiryDate);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error initializing from session:", err);
        setLoading(false);
      }
    };

    // Initialize from session immediately
    initializeFromSession();
  }, []);

  // Listen for auth state changes AFTER the initial session check
  useEffect(() => {
    if (!auth) {
      return () => {}; // No Firebase, nothing to clean up
    }

    // Only set up Firebase listener if we couldn't restore from session
    if (!user || user.isSessionUser) {
      const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
        try {
          if (authUser) {
            // User is signed in with Firebase
            setUser(authUser);

            // Get user profile
            const profile = await getUserProfile(authUser.uid);
            if (profile) {
              setUserProfile(profile);
            }

            // Check premium status
            const premiumStatus = await checkPremiumStatus(authUser.uid);
            setIsPremium(premiumStatus.isPremium);
            if (premiumStatus.isPremium) {
              setPremiumExpiryDate(premiumStatus.expiryDate);
            }
          } else if (!user || !user.isSessionUser) {
            // Only clear user if we don't have a session user
            setUser(null);
            setUserProfile(null);

            // We might still have premium status from localStorage
            const premiumStatus = await checkPremiumStatus();
            setIsPremium(premiumStatus.isPremium);
            if (premiumStatus.isPremium) {
              setPremiumExpiryDate(premiumStatus.expiryDate);
            } else {
              setPremiumExpiryDate(null);
            }
          }
        } catch (err) {
          console.error("Error in auth state change:", err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      });

      // Cleanup function
      return () => {
        unsubscribe();
      };
    }

    return () => {};
  }, [user]);

  // Login function
  const login = async (username, password) => {
    try {
      clearError();
      setLoading(true);

      // Call login function from firebase.js
      const result = await loginWithUsernameAndPassword(username, password);

      if (result.success) {
        setUser(result.user);
        setUserProfile(result.userData);

        // Check premium status
        const premiumStatus = await checkPremiumStatus(result.user.uid);
        setIsPremium(premiumStatus.isPremium);
        if (premiumStatus.isPremium) {
          setPremiumExpiryDate(premiumStatus.expiryDate);
        }

        return { success: true, user: result.userData };
      } else {
        setError(result.error || "فشل تسجيل الدخول");
        return { success: false, error: result.error };
      }
    } catch (err) {
      console.error("Error logging in:", err);
      setError(err.message || "حدث خطأ أثناء تسجيل الدخول");
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      clearError();
      setLoading(true);

      // Call register function from firebase.js
      const result = await registerUser(userData);

      if (result.success) {
        setUser(result.user);
        setUserProfile(result.userData);
        return { success: true, user: result.userData };
      } else {
        setError(result.error || "فشل إنشاء الحساب");
        return { success: false, error: result.error };
      }
    } catch (err) {
      console.error("Error registering:", err);
      setError(err.message || "حدث خطأ أثناء إنشاء الحساب");
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async (preservePremium = true) => {
    try {
      clearError();
      setLoading(true);

      // Call logout function from firebase.js
      const result = await logoutUser(preservePremium);

      if (result.success) {
        setUser(null);
        setUserProfile(null);

        // We might keep premium status if preservePremium is true
        if (!preservePremium) {
          setIsPremium(false);
          setPremiumExpiryDate(null);
        }

        return true;
      } else {
        setError(result.error || "فشل تسجيل الخروج");
        return false;
      }
    } catch (err) {
      console.error("Error logging out:", err);
      setError(err.message || "حدث خطأ أثناء تسجيل الخروج");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update profile function
  const updateProfile = async (userData) => {
    try {
      clearError();

      if (!user && !userProfile) {
        throw new Error("لم يتم تسجيل الدخول");
      }

      // Get user ID from either Firebase user or local profile
      const uid = user?.uid || userProfile?.uid;

      // Call update function from firebase.js
      const result = await updateUserProfile(uid, userData);

      if (result.success) {
        // Update local state
        setUserProfile((prev) => ({
          ...prev,
          ...userData,
        }));

        return { success: true };
      } else {
        setError(result.error || "فشل تحديث الملف الشخصي");
        return { success: false, error: result.error };
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.message || "حدث خطأ أثناء تحديث الملف الشخصي");
      return { success: false, error: err.message };
    }
  };

  // Activate premium subscription
  const activatePremium = async (duration = 30) => {
    try {
      clearError();

      // Calculate expiry date
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + duration);

      // Get user ID from either Firebase user or local profile
      const uid = user?.uid || userProfile?.uid;

      // Call premium activation function from firebase.js
      const result = await setPremiumStatus(uid, expiryDate);

      if (result.success) {
        // Update local state
        setIsPremium(true);
        setPremiumExpiryDate(expiryDate.toISOString());

        return {
          success: true,
          expiryDate: expiryDate.toISOString(),
          expiryFormatted: expiryDate.toLocaleDateString("ar-EG", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        };
      } else {
        setError(result.error || "فشل تفعيل العضوية المميزة");
        return { success: false, error: result.error };
      }
    } catch (err) {
      console.error("Error activating premium:", err);
      setError(err.message || "حدث خطأ أثناء تفعيل العضوية المميزة");
      return { success: false, error: err.message };
    }
  };

  // Check premium status function
  const checkPremiumStatusFn = async () => {
    try {
      clearError();

      // Get user ID from either Firebase user or local profile
      const uid = user?.uid || userProfile?.uid;

      // Call premium status check function from firebase.js
      const status = await checkPremiumStatus(uid);

      // Update local state
      setIsPremium(status.isPremium);
      if (status.isPremium && status.expiryDate) {
        setPremiumExpiryDate(status.expiryDate);
      } else {
        setPremiumExpiryDate(null);
      }

      return status;
    } catch (err) {
      console.error("Error checking premium status:", err);
      setError(err.message || "حدث خطأ أثناء التحقق من حالة العضوية");
      return { isPremium: false, error: err.message };
    }
  };

  // Context value
  const value = {
    user,
    userProfile,
    loading,
    error,
    isPremium,
    premiumExpiryDate,
    login,
    register,
    logout,
    updateProfile,
    activatePremium,
    checkPremiumStatus: checkPremiumStatusFn,
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
