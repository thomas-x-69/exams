// utils/premiumService.js
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  Timestamp,
  collection,
  addDoc,
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
            subscriptionType: userData.subscriptionType || "monthly",
            autoRenew: userData.autoRenew || false,
          };
        } else {
          // Premium has expired, update both Firestore and localStorage
          await updateDoc(userRef, {
            isPremium: false,
            updatedAt: Timestamp.now(),
            subscription_expired: true,
            subscription_expiredAt: Timestamp.now(),
          });

          localStorage.setItem("premiumUser", "false");
          localStorage.removeItem("premiumExpiry");
          localStorage.setItem("subscription_expired", "true");
          localStorage.setItem(
            "subscription_expired_at",
            new Date().toISOString()
          );

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
        localStorage.setItem("subscription_cancelled", "true");
        localStorage.setItem("subscription_expired", now.toISOString());
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
        subscriptionType:
          localStorage.getItem("subscription_type") || "monthly",
        autoRenew: localStorage.getItem("subscription_autorenew") === "true",
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

// Grant premium access to a user
export const activatePremium = async (
  userId = null,
  duration = 30,
  subscriptionType = "monthly"
) => {
  try {
    // Set expiry date
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + duration);

    // If userId is provided, update Firestore
    if (userId) {
      const db = getFirestore();
      const userRef = doc(db, "users", userId);

      // Update user document
      await updateDoc(userRef, {
        isPremium: true,
        premiumExpiryDate: Timestamp.fromDate(expiryDate),
        subscriptionType: subscriptionType,
        autoRenew: true,
        subscription_start: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      // Create subscription record
      const subscriptionData = {
        userId,
        startDate: Timestamp.now(),
        endDate: Timestamp.fromDate(expiryDate),
        type: subscriptionType,
        status: "active",
        price:
          subscriptionType === "monthly"
            ? 99
            : subscriptionType === "quarterly"
            ? 270
            : subscriptionType === "yearly"
            ? 990
            : 99,
        autoRenew: true,
        createdAt: Timestamp.now(),
      };

      await addDoc(collection(db, "subscriptions"), subscriptionData);
    }

    // Set premium flag in localStorage (for compatibility and non-logged-in users)
    localStorage.setItem("premiumUser", "true");
    localStorage.setItem("premiumExpiry", expiryDate.toISOString());

    // Store subscription info
    localStorage.setItem("subscription_start", new Date().toISOString());
    localStorage.setItem("subscription_type", subscriptionType);
    localStorage.setItem("subscription_autorenew", "true");
    localStorage.setItem(
      "subscription_price",
      subscriptionType === "monthly"
        ? "99"
        : subscriptionType === "quarterly"
        ? "270"
        : subscriptionType === "yearly"
        ? "990"
        : "99"
    );

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

    // Try localStorage as fallback
    try {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + duration);

      localStorage.setItem("premiumUser", "true");
      localStorage.setItem("premiumExpiry", expiryDate.toISOString());
      localStorage.setItem("subscription_start", new Date().toISOString());
      localStorage.setItem("subscription_type", subscriptionType);

      return {
        success: true,
        expiryDate: expiryDate.toISOString(),
        expiryFormatted: expiryDate.toLocaleDateString("ar-EG", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      };
    } catch (localStorageError) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
};

// Revoke premium access (cancel subscription)
export const revokePremium = async (userId = null) => {
  try {
    // If userId is provided, update Firestore
    if (userId) {
      const db = getFirestore();
      const userRef = doc(db, "users", userId);

      // Mark as cancelled but don't remove access yet
      await updateDoc(userRef, {
        autoRenew: false,
        subscription_cancelled: true,
        subscription_cancelledAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
    }

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

    // Try localStorage as fallback
    localStorage.setItem("subscription_cancelled", "true");
    localStorage.setItem("subscription_autorenew", "false");

    return {
      success: true,
      message:
        "تم إلغاء الاشتراك بنجاح. يمكنك الاستمرار في استخدام المميزات حتى نهاية الفترة الحالية.",
    };
  }
};

// Get premium expiry date info
export const getPremiumExpiryInfo = async (userId = null) => {
  // Use the checkPremiumStatus function
  return await checkPremiumStatus(userId);
};

// Handle successful payment
export const handleSuccessfulPayment = async (
  userId = null,
  planInfo = null
) => {
  try {
    // Determine duration based on plan
    let duration = 30; // Default: 30 days (monthly)
    let type = "monthly"; // Default plan type

    if (planInfo) {
      if (planInfo.id === "yearly") {
        duration = 365; // 1 year
        type = "yearly";
      } else if (planInfo.id === "quarterly") {
        duration = 90; // 3 months
        type = "quarterly";
      } else if (planInfo.id === "monthly") {
        duration = 30; // 30 days (monthly)
        type = "monthly";
      }
    }

    // Activate premium with appropriate duration
    return await activatePremium(userId, duration, type);
  } catch (error) {
    console.error("Error handling successful payment:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Handle subscription renewal
export const renewSubscription = async (userId = null) => {
  try {
    // If userId is provided, check Firestore
    if (userId) {
      const db = getFirestore();
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        return {
          success: false,
          message: "المستخدم غير موجود",
        };
      }

      const userData = userDoc.data();

      if (
        !userData.isPremium ||
        userData.subscription_cancelled ||
        !userData.autoRenew
      ) {
        return {
          success: false,
          message: "الاشتراك غير قابل للتجديد أو تم إلغاؤه",
        };
      }

      // Determine duration based on subscription type
      let duration = 30; // Default: 30 days (monthly)
      let type = userData.subscriptionType || "monthly";

      if (type === "yearly") {
        duration = 365; // 1 year
      } else if (type === "quarterly") {
        duration = 90; // 3 months
      }

      // Activate premium with appropriate duration
      return await activatePremium(userId, duration, type);
    }

    // Fallback to localStorage
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

    // Determine duration based on subscription type
    let duration = 30; // Default: 30 days (monthly)

    if (subscriptionType === "yearly") {
      duration = 365; // 1 year
    } else if (subscriptionType === "quarterly") {
      duration = 90; // 3 months
    }

    // Renew subscription
    return await activatePremium(null, duration, subscriptionType);
  } catch (error) {
    console.error("Error renewing subscription:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};
