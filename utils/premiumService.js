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
        localStorage.setItem("subscription_cancelled", "true");
        localStorage.setItem("subscription_expired", now.toISOString());
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

    // Store subscription info
    localStorage.setItem("subscription_start", new Date().toISOString());
    localStorage.setItem("subscription_type", "monthly");
    localStorage.setItem("subscription_autorenew", "true");
    localStorage.setItem("subscription_price", "29");

    // Clear cancelled flag if exists
    localStorage.removeItem("subscription_cancelled");
    localStorage.removeItem("subscription_expired");

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
      nextBillingDate: expiryDate.toLocaleDateString("ar-EG", {
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

// Revoke premium access (cancel subscription)
export const revokePremium = () => {
  try {
    // We don't immediately remove access, but mark it as cancelled and won't auto-renew
    localStorage.setItem("subscription_cancelled", "true");
    localStorage.setItem("subscription_autorenew", "false");
    localStorage.setItem("subscription_cancel_date", new Date().toISOString());

    // User can still access premium until expiry date
    return {
      success: true,
      message:
        "تم إلغاء الاشتراك بنجاح. يمكنك الاستمرار في استخدام المميزات حتى نهاية الفترة الحالية.",
    };
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
    const subscriptionType =
      localStorage.getItem("subscription_type") || "monthly";
    const autoRenew = localStorage.getItem("subscription_autorenew") === "true";
    const isCancelled =
      localStorage.getItem("subscription_cancelled") === "true";

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
      subscriptionType,
      autoRenew,
      isCancelled,
      expiryDate: expiryDateStr,
      expiryFormatted: expiryDate.toLocaleDateString("ar-EG", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      daysRemaining: Math.max(0, diffDays),
      nextBillingDate: autoRenew
        ? expiryDate.toLocaleDateString("ar-EG", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : null,
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
    // Determine duration based on plan
    let duration = 30; // Default: 30 days (monthly)

    if (planInfo) {
      if (planInfo.id === "yearly") {
        duration = 365; // 1 year
      } else if (planInfo.id === "lifetime") {
        duration = 36500; // 100 years (effectively lifetime)
      } else if (planInfo.id === "monthly") {
        duration = 30; // 30 days (monthly)
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

// Handle subscription renewal
export const renewSubscription = () => {
  try {
    // Check if subscription should be renewed
    const isPremium = localStorage.getItem("premiumUser") === "true";
    const autoRenew = localStorage.getItem("subscription_autorenew") === "true";
    const isCancelled =
      localStorage.getItem("subscription_cancelled") === "true";

    if (!isPremium || !autoRenew || isCancelled) {
      return {
        success: false,
        message: "الاشتراك غير قابل للتجديد أو تم إلغاؤه",
      };
    }

    // Get subscription type
    const subscriptionType =
      localStorage.getItem("subscription_type") || "monthly";

    // Renew subscription based on type
    if (subscriptionType === "monthly") {
      return activatePremium(30);
    } else if (subscriptionType === "yearly") {
      return activatePremium(365);
    }

    return {
      success: false,
      message: "نوع الاشتراك غير معروف",
    };
  } catch (error) {
    console.error("Error renewing subscription:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};
