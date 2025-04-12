// context/ClientAuthContext.js
"use client";

import { createContext, useContext, useEffect, useState } from "react";

// Create auth context
const ClientAuthContext = createContext({
  user: null,
  loading: true,
  isPremium: false,
  premiumExpiryDate: null,
  login: async () => {},
  logout: () => {},
  activatePremium: async () => {},
  checkPremiumStatus: () => {},
});

// Auth provider component
export const ClientAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const [premiumExpiryDate, setPremiumExpiryDate] = useState(null);

  // Load user data from localStorage
  useEffect(() => {
    try {
      setLoading(true);

      // Get user from localStorage
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      }

      // Check premium status
      const localIsPremium = localStorage.getItem("premiumUser") === "true";
      const localExpiryDate = localStorage.getItem("premiumExpiry");

      if (localIsPremium && localExpiryDate) {
        const expiryDate = new Date(localExpiryDate);
        const now = new Date();

        if (expiryDate > now) {
          setIsPremium(true);
          setPremiumExpiryDate(expiryDate);
        } else {
          // Premium expired
          setIsPremium(false);
          setPremiumExpiryDate(null);
          localStorage.setItem("premiumUser", "false");
          localStorage.removeItem("premiumExpiry");
        }
      } else {
        setIsPremium(false);
        setPremiumExpiryDate(null);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Login/Register function - just save to localStorage
  const login = async (userData) => {
    try {
      // Save user data to localStorage
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("userName", userData.name || "المستخدم");

      // Update state
      setUser(userData);

      return { success: true, user: userData };
    } catch (error) {
      console.error("Error logging in:", error);
      return { success: false, error: error.message };
    }
  };

  // Logout function
  const logout = () => {
    try {
      // Clear user data from localStorage
      localStorage.removeItem("user");
      localStorage.removeItem("userName");

      // Don't remove premium status on logout to allow multiple devices

      // Update state
      setUser(null);

      return true;
    } catch (error) {
      console.error("Error logging out:", error);
      return false;
    }
  };

  // Activate premium subscription
  const activatePremium = async (duration = 30) => {
    try {
      // Calculate expiry date
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + duration);

      // Save premium status to localStorage
      localStorage.setItem("premiumUser", "true");
      localStorage.setItem("premiumExpiry", expiryDate.toISOString());

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

  // Check premium status
  const checkPremiumStatus = () => {
    try {
      const localIsPremium = localStorage.getItem("premiumUser") === "true";
      const localExpiryDate = localStorage.getItem("premiumExpiry");

      if (localIsPremium && localExpiryDate) {
        const expiryDate = new Date(localExpiryDate);
        const now = new Date();

        if (expiryDate > now) {
          // Still valid
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
    loading,
    isPremium,
    premiumExpiryDate,
    login,
    logout,
    activatePremium,
    checkPremiumStatus,
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
