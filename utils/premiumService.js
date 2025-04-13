// utils/premiumService.js
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";

/**
 * Utilities for managing premium subscription status
 * This file provides both Firebase and localStorage-based functionality for compatibility
 */

// Check if a user has premium access
export const checkPremiumStatus = async (userId = null) => {
  try {
    // If userId is provided, check in Firestore
    if (userId) {
      const db = getFirestore();
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        return { isPremium: false };
      }

      const userData = userDoc.data();

      if (userData.isPremium && userData.premiumExpiryDate) {
        const expiryDate = userData.premiumExpiryDate.toDate();
        const now = new Date();

        if (expiryDate > now) {
          // Update localStorage for compatibility
          localStorage.setItem("premiumUser", "true");
          localStorage.setItem("premiumExpiry", expiryDate.toISOString());

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
          // Premium has expired, update both Firestore and localStorage
          await updateDoc(userRef, {
            isPremium: false,
            updatedAt: Timestamp.now(),
          });

          localStorage.setItem("premiumUser", "false");
          localStorage.removeItem("premiumExpiry");

          return { isPremium: false };
        }
      }

      return { isPremium: false };
    }

    // Fallback to localStorage
    const isPremium = localStorage.getItem("premiumUser") === "true";
    const expiryDate = localStorage.getItem("premiumExpiry");

    // If premium but expired, revoke access
    if (isPremium && expiryDate) {
      const now = new Date();
      const expiry = new Date(expiryDate);

      if (now > expiry) {
        // Premium has expired
        localStorage.setItem("premiumUser", "false");
        localStorage.removeItem("premiumExpiry");
        return { isPremium: false };
      }

      return {
        isPremium: true,
        expiryDate: expiry,
        expiryFormatted: expiry.toLocaleDateString("ar-EG", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        daysRemaining: Math.ceil((expiry - now) / (1000 * 60 * 60 * 24)),
      };
    }

    return { isPremium: false };
  } catch (error) {
    console.error("Error checking premium status:", error);

    // Fallback to localStorage in case of Firestore error
    const isPremium = localStorage.getItem("premiumUser") === "true";
    const expiryDate = localStorage.getItem("premiumExpiry");

    if (isPremium && expiryDate) {
      const now = new Date();
      const expiry = new Date(expiryDate);

      if (now < expiry) {
        return {
          isPremium: true,
          expiryDate: expiry,
          expiryFormatted: expiry.toLocaleDateString("ar-EG", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          daysRemaining: Math.ceil((expiry - now) / (1000 * 60 * 60 * 24)),
        };
      }
    }

    return { isPremium: false, error: error.message };
  }
};

// Get premium expiry info
export const getPremiumExpiryInfo = () => {
  try {
    const isPremium = localStorage.getItem("premiumUser") === "true";
    const expiryDate = localStorage.getItem("premiumExpiry");

    if (isPremium && expiryDate) {
      const now = new Date();
      const expiry = new Date(expiryDate);

      if (now < expiry) {
        return {
          isPremium: true,
          expiryDate: expiry,
          expiryFormatted: expiry.toLocaleDateString("ar-EG", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          daysRemaining: Math.ceil((expiry - now) / (1000 * 60 * 60 * 24)),
        };
      }
    }

    return { isPremium: false };
  } catch (error) {
    console.error("Error getting premium expiry info:", error);
    return { isPremium: false };
  }
};
