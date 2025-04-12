// lib/firebase.js
import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  Timestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";

// Your Firebase configuration - Replace with your actual Firebase config values
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
let app;
let auth;
let db;
let functions;

// Ensure Firebase is only initialized on the client side and only once
if (typeof window !== "undefined") {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
  auth = getAuth(app);
  db = getFirestore(app);
  functions = getFunctions(app);
}

// Helper function to create a RecaptchaVerifier instance
export const createRecaptchaVerifier = (containerId, callback) => {
  try {
    if (typeof window === "undefined") return null;

    window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: "invisible",
      callback: callback,
    });
    return window.recaptchaVerifier;
  } catch (error) {
    console.error("Error creating RecaptchaVerifier:", error);
    throw error;
  }
};

// Helper function to sign in with phone number
export const signInWithPhone = async (phoneNumber, recaptchaVerifier) => {
  try {
    const confirmationResult = await signInWithPhoneNumber(
      auth,
      phoneNumber,
      recaptchaVerifier
    );
    if (typeof window !== "undefined") {
      window.confirmationResult = confirmationResult;
    }
    return confirmationResult;
  } catch (error) {
    console.error("Error during signInWithPhone:", error);
    throw error;
  }
};

// Helper function to verify phone code
export const verifyCode = async (code) => {
  try {
    if (typeof window === "undefined" || !window.confirmationResult) {
      throw new Error("No confirmation result found");
    }
    return await window.confirmationResult.confirm(code);
  } catch (error) {
    console.error("Error verifying code:", error);
    throw error;
  }
};

// For simplicity with a client-side only Firebase app without complex server authentication
// We'll use a simpler approach with localStorage for user tracking
// This is a simplified example - in a production app, you should implement proper authentication
export const registerUser = async (userData) => {
  try {
    const { name, phone, password } = userData;

    // Save user data to localStorage
    const newUser = {
      id: `user_${Date.now()}`,
      name,
      phone,
      password, // Note: In a real app, never store plain text passwords
      createdAt: new Date().toISOString(),
      isPremium: false,
      premiumExpiryDate: null,
    };

    localStorage.setItem("user", JSON.stringify(newUser));
    localStorage.setItem("userName", name);
    localStorage.setItem("userPhone", phone);

    return { user: { uid: newUser.id }, userData: newUser };
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

// Login user with phone and password - simplified for client-side demo
export const loginWithPhoneAndPassword = async (phone, password) => {
  try {
    // Get user from localStorage
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      throw new Error("User not found");
    }

    const user = JSON.parse(storedUser);

    // Verify phone and password
    if (user.phone !== phone || user.password !== password) {
      throw new Error("Invalid phone number or password");
    }

    // Save current user data
    localStorage.setItem("userName", user.name);
    localStorage.setItem("userPhone", user.phone);

    return { user: { uid: user.id }, userData: user };
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

// User profile management - simplified for client-side demo
export const getUserProfile = async (uid) => {
  try {
    // Get user from localStorage
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      return null;
    }

    const user = JSON.parse(storedUser);
    return user;
  } catch (error) {
    console.error("Error getting user profile:", error);
    throw error;
  }
};

export const updateUserProfile = async (uid, userData) => {
  try {
    // Get current user data
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      throw new Error("User not found");
    }

    const user = JSON.parse(storedUser);

    // Update user data
    const updatedUser = {
      ...user,
      ...userData,
      updatedAt: new Date().toISOString(),
    };

    // Save updated user data
    localStorage.setItem("user", JSON.stringify(updatedUser));

    // Update name in localStorage if changed
    if (userData.name) {
      localStorage.setItem("userName", userData.name);
    }

    return true;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

// Premium subscription management
export const setPremiumStatus = async (uid, expiryDate) => {
  try {
    // Get current user data
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      throw new Error("User not found");
    }

    const user = JSON.parse(storedUser);

    // Update user premium status
    const updatedUser = {
      ...user,
      isPremium: true,
      premiumExpiryDate: expiryDate.toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save updated user data
    localStorage.setItem("user", JSON.stringify(updatedUser));

    // Update premium status in localStorage
    localStorage.setItem("premiumUser", "true");
    localStorage.setItem("premiumExpiry", expiryDate.toISOString());

    return true;
  } catch (error) {
    console.error("Error setting premium status:", error);
    throw error;
  }
};

export const checkPremiumStatus = async (uid) => {
  try {
    // Get user from localStorage
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      return { isPremium: false };
    }

    const user = JSON.parse(storedUser);

    // Check if user has premium access
    if (!user.isPremium || !user.premiumExpiryDate) {
      return { isPremium: false };
    }

    // Check if premium has expired
    const expiryDate = new Date(user.premiumExpiryDate);
    const now = new Date();

    const isPremium = expiryDate > now;

    // Update localStorage for consistency
    localStorage.setItem("premiumUser", isPremium ? "true" : "false");
    if (isPremium) {
      localStorage.setItem("premiumExpiry", user.premiumExpiryDate);
    } else {
      localStorage.removeItem("premiumExpiry");

      // Update user data if premium expired
      const updatedUser = {
        ...user,
        isPremium: false,
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
    }

    if (isPremium) {
      return {
        isPremium: true,
        expiryDate: expiryDate,
        expiryFormatted: expiryDate.toLocaleDateString("ar-EG", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        daysRemaining: Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24)),
      };
    } else {
      return { isPremium: false };
    }
  } catch (error) {
    console.error("Error checking premium status:", error);
    return { isPremium: false, error: error.message };
  }
};

// Payment processing - simplified for client-side demo
export const createPaymentSession = async (amount, planId, userData) => {
  try {
    // Simulate creating a payment session
    const orderId = `order_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 8)}`;

    // In a real app, you would call your payment gateway API here
    const paymentSession = {
      success: true,
      orderId,
      iframeUrl: `/payment-simulator.html?order_id=${orderId}&amount=${amount}&plan=${planId}`,
      paymentToken: `token_${orderId}`,
      amount,
      planId,
      userData,
    };

    return paymentSession;
  } catch (error) {
    console.error("Error creating payment session:", error);
    throw error;
  }
};

export const verifyPayment = async (orderId) => {
  try {
    // Simulate verifying a payment - in a real app, you would call your payment gateway API
    // For demo purposes, always return success
    return {
      success: true,
      status: "paid",
      message: "تم الدفع بنجاح",
      verifiedByServer: true,
      order: {
        id: orderId,
        amount: 99,
        date: new Date().toISOString(),
      },
    };
  } catch (error) {
    console.error("Error verifying payment:", error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    // Clear user data from localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("userName");
    localStorage.removeItem("userPhone");

    // Keep premium status for now

    return true;
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
};

// Define functions to export even if Firebase isn't initialized (for server-side rendering)
const mockAuth = {};
const mockDb = {};
const mockFunctions = {};

export { auth as auth, db as db, functions as functions };
