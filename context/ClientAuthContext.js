// context/ClientAuthContext.js
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import {
  auth,
  getUserProfile,
  loginWithPhoneAndPassword,
  registerUser,
  updateUserProfile,
  setPremiumStatus,
  checkPremiumStatus,
  logoutUser,
} from "../lib/firebase";

// Create auth context
const ClientAuthContext = createContext({
  user: null,
  userProfile: null,
  loading: true,
  isPremium: false,
  premiumExpiryDate: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  updateProfile: async () => {},
  activatePremium: async () => {},
  checkPremiumStatus: () => {},
});

// Auth provider component
export const ClientAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const [premiumExpiryDate, setPremiumExpiryDate] = useState(null);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      try {
        setLoading(true);

        if (authUser) {
          // User is signed in
          setUser(authUser);

          // Get user profile from Firestore
          const profile = await getUserProfile(authUser.uid);
          setUserProfile(profile);

          // Check premium status
          const premiumStatus = await checkPremiumStatus(authUser.uid);
          setIsPremium(premiumStatus.isPremium);
          if (premiumStatus.isPremium) {
            setPremiumExpiryDate(premiumStatus.expiryDate);
          } else {
            setPremiumExpiryDate(null);
          }
        } else {
          // User is signed out
          setUser(null);
          setUserProfile(null);

          // Check localStorage for premium status (for compatibility)
          const localIsPremium = localStorage.getItem("premiumUser") === "true";
          const localExpiryDate = localStorage.getItem("premiumExpiry");

          if (localIsPremium && localExpiryDate) {
            const expiryDate = new Date(localExpiryDate);
            const now = new Date();

            if (expiryDate > now) {
              setIsPremium(true);
              setPremiumExpiryDate(expiryDate);
            } else {
              setIsPremium(false);
              setPremiumExpiryDate(null);
              localStorage.setItem("premiumUser", "false");
              localStorage.removeItem("premiumExpiry");
            }
          } else {
            setIsPremium(false);
            setPremiumExpiryDate(null);
          }
        }
      } catch (error) {
        console.error("Error in auth state change:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Login function
  const login = async (phoneNumber, password) => {
    try {
      setLoading(true);
      const { user, userData } = await loginWithPhoneAndPassword(
        phoneNumber,
        password
      );
      setUser(user);
      setUserProfile(userData);

      // Check premium status
      const premiumStatus = await checkPremiumStatus(user.uid);
      setIsPremium(premiumStatus.isPremium);
      if (premiumStatus.isPremium) {
        setPremiumExpiryDate(premiumStatus.expiryDate);
      }

      return { success: true, user: userData };
    } catch (error) {
      console.error("Error logging in:", error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setLoading(true);
      const { user, userData: profile } = await registerUser(userData);
      setUser(user);
      setUserProfile(profile);

      return { success: true, user: profile };
    } catch (error) {
      console.error("Error registering:", error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setLoading(true);
      await logoutUser();
      setUser(null);
      setUserProfile(null);

      // Keep premium status in localStorage for compatibility
      return true;
    } catch (error) {
      console.error("Error logging out:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update profile function
  const updateProfile = async (userData) => {
    try {
      if (!user) throw new Error("User not authenticated");

      await updateUserProfile(user.uid, userData);

      // Update local state
      setUserProfile((prev) => ({
        ...prev,
        ...userData,
      }));

      return { success: true };
    } catch (error) {
      console.error("Error updating profile:", error);
      return { success: false, error: error.message };
    }
  };

  // Activate premium subscription
  const activatePremium = async (duration = 30) => {
    try {
      // Calculate expiry date
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + duration);

      // If user is logged in, update Firestore
      if (user) {
        await setPremiumStatus(user.uid, expiryDate);
      } else {
        // Just save to localStorage for non-logged in users
        localStorage.setItem("premiumUser", "true");
        localStorage.setItem("premiumExpiry", expiryDate.toISOString());
      }

      // Update state
      setIsPremium(true);
      setPremiumExpiryDate(expiryDate);

      return {
        success: true,
        expiryDate: expiryDate.toISOString(),
        expiryFormatted: expiryDate.toLocaleDateString("ar-EG", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      };
    } catch (error) {
      console.error("Error activating premium:", error);
      return { success: false, error: error.message };
    }
  };

  // Check premium status function
  const checkPremiumStatusFn = async () => {
    try {
      // If user is logged in, check Firestore
      if (user) {
        const status = await checkPremiumStatus(user.uid);
        setIsPremium(status.isPremium);
        if (status.isPremium) {
          setPremiumExpiryDate(status.expiryDate);
        } else {
          setPremiumExpiryDate(null);
        }
        return status;
      }

      // Otherwise check localStorage (for compatibility)
      const localIsPremium = localStorage.getItem("premiumUser") === "true";
      const localExpiryDate = localStorage.getItem("premiumExpiry");

      if (localIsPremium && localExpiryDate) {
        const expiryDate = new Date(localExpiryDate);
        const now = new Date();

        if (expiryDate > now) {
          setIsPremium(true);
          setPremiumExpiryDate(expiryDate);

          return {
            isPremium: true,
            expiryDate: expiryDate,
            expiryFormatted: expiryDate.toLocaleDateString("ar-EG", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
            daysRemaining: Math.ceil(
              (expiryDate - now) / (1000 * 60 * 60 * 24)
            ),
          };
        } else {
          setIsPremium(false);
          setPremiumExpiryDate(null);
          localStorage.setItem("premiumUser", "false");
          localStorage.removeItem("premiumExpiry");
        }
      }

      return { isPremium: false };
    } catch (error) {
      console.error("Error checking premium status:", error);
      return { isPremium: false, error: error.message };
    }
  };

  // Context value
  const value = {
    user,
    userProfile,
    loading,
    isPremium,
    premiumExpiryDate,
    login,
    register,
    logout,
    updateProfile,
    activatePremium,
    checkPremiumStatus: checkPremiumStatusFn,
  };

  return (
    <ClientAuthContext.Provider value={value}>
      {children}
    </ClientAuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useClientAuth = () => {
  const context = useContext(ClientAuthContext);
  if (context === undefined) {
    throw new Error("useClientAuth must be used within a ClientAuthProvider");
  }
  return context;
};
