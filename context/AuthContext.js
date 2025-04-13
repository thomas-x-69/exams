// context/AuthContext.js
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import {
  auth,
  getUserProfile,
  loginWithEmailAndPassword,
  registerUser,
  updateUserProfile,
  setPremiumStatus,
  checkPremiumStatus,
  logoutUser,
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

  // Listen for auth state changes
  useEffect(() => {
    // Initial loading
    setLoading(true);

    // Check for locally stored user data first (faster initial load)
    const checkLocalData = async () => {
      try {
        // Check localStorage for user data
        const savedUserData = localStorage.getItem("user_data");
        if (savedUserData) {
          const userData = JSON.parse(savedUserData);
          setUserProfile(userData);
          // If we have cached user data but no Firebase user yet, create a placeholder
          if (!user) {
            setUser({ uid: userData.uid });
          }
        }

        // Check premium status (this uses localStorage)
        const premiumStatus = await checkPremiumStatus();
        setIsPremium(premiumStatus.isPremium);
        if (premiumStatus.isPremium) {
          setPremiumExpiryDate(premiumStatus.expiryDate);
        }
      } catch (err) {
        console.error("Error checking local data:", err);
      }
    };

    // Run local data check
    checkLocalData();

    // Set up Firebase Auth listener
    const unsubscribe = auth
      ? onAuthStateChanged(auth, async (authUser) => {
          try {
            if (authUser) {
              // User is signed in
              setUser(authUser);

              // Get user profile - first from localStorage, then Firestore if needed
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
            } else {
              // User is signed out
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
        })
      : () => {
          setLoading(false);
        };

    // Cleanup function
    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      clearError();
      setLoading(true);

      // Call login function from firebase.js
      const result = await loginWithEmailAndPassword(email, password);

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
