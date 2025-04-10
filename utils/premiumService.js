// utils/premiumService.js
/**
 * Utilities for managing premium subscription status
 */

// Check if a user has premium access
export const checkPremiumStatus = () => {
  try {
    // In a production app, you'd verify with your backend/database
    // This is a simplified client-side implementation for demo purposes
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
        return false;
      }
    }

    return isPremium;
  } catch (error) {
    console.error("Error checking premium status:", error);
    return false;
  }
};

// Grant premium access to a user
export const activatePremium = (duration = 30) => {
  try {
    // Set premium flag
    localStorage.setItem("premiumUser", "true");

    // Set expiry date (default: 30 days / 1 month)
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + duration);
    localStorage.setItem("premiumExpiry", expiryDate.toISOString());

    // Set username from temporary storage if available
    const userName = localStorage.getItem("tempUserName");
    if (userName) {
      localStorage.setItem("userName", userName);
    }

    // Clear temp user info
    localStorage.removeItem("tempUserName");
    localStorage.removeItem("tempUserEmail");
    localStorage.removeItem("tempUserPhone");
    localStorage.removeItem("currentOrderId");

    // Return success with expiry info
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
    return {
      success: false,
      error: error.message,
    };
  }
};

// Revoke premium access
export const revokePremium = () => {
  try {
    localStorage.setItem("premiumUser", "false");
    localStorage.removeItem("premiumExpiry");

    return { success: true };
  } catch (error) {
    console.error("Error revoking premium:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Get premium expiry date info
export const getPremiumExpiryInfo = () => {
  try {
    const isPremium = localStorage.getItem("premiumUser") === "true";
    const expiryDateStr = localStorage.getItem("premiumExpiry");

    if (!isPremium || !expiryDateStr) {
      return {
        isPremium: false,
        expiryDate: null,
        daysRemaining: 0,
      };
    }

    const expiryDate = new Date(expiryDateStr);
    const now = new Date();

    // Calculate days remaining
    const diffTime = expiryDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return {
      isPremium: true,
      expiryDate: expiryDateStr,
      expiryFormatted: expiryDate.toLocaleDateString("ar-EG", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      daysRemaining: Math.max(0, diffDays),
    };
  } catch (error) {
    console.error("Error getting premium expiry info:", error);
    return {
      isPremium: false,
      error: error.message,
    };
  }
};

// Handle successful payment
export const handleSuccessfulPayment = (planInfo) => {
  try {
    // Default to 30 days (monthly)
    let duration = 30;

    if (planInfo) {
      if (planInfo.id === "monthly") {
        duration = 30; // 1 month
      } else if (planInfo.id === "quarterly") {
        duration = 90; // 3 months
      } else if (planInfo.id === "yearly") {
        duration = 365; // 1 year
      }
    }

    // Activate premium with appropriate duration
    return activatePremium(duration);
  } catch (error) {
    console.error("Error handling successful payment:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};
