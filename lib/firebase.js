// lib/firebase.js
import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  signInWithPhoneNumber,
  RecaptchaVerifier,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";

// Your Firebase configuration
// Replace with your actual Firebase config values
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
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Auth exports
export const auth = getAuth(app);

// Firestore exports
export const db = getFirestore(app);

// Helper function to create a RecaptchaVerifier instance
export const createRecaptchaVerifier = (containerId, callback) => {
  try {
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
    window.confirmationResult = confirmationResult;
    return confirmationResult;
  } catch (error) {
    console.error("Error during signInWithPhone:", error);
    throw error;
  }
};

// Helper function to verify code
export const verifyCode = async (code) => {
  try {
    if (!window.confirmationResult) {
      throw new Error("No confirmation result found");
    }
    return await window.confirmationResult.confirm(code);
  } catch (error) {
    console.error("Error verifying code:", error);
    throw error;
  }
};

// User management functions
export const createUserProfile = async (uid, userData) => {
  try {
    // Add creation time and premium expiry date (if this is a premium subscription)
    const userDocRef = doc(db, "users", uid);
    await setDoc(userDocRef, {
      ...userData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return userDocRef;
  } catch (error) {
    console.error("Error creating user profile:", error);
    throw error;
  }
};

export const getUserProfile = async (uid) => {
  try {
    const userDocRef = doc(db, "users", uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      return { id: userDoc.id, ...userDoc.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting user profile:", error);
    throw error;
  }
};

export const updateUserProfile = async (uid, userData) => {
  try {
    const userDocRef = doc(db, "users", uid);
    await updateDoc(userDocRef, {
      ...userData,
      updatedAt: Timestamp.now(),
    });
    return userDocRef;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

// Premium subscription management
export const setPremiumStatus = async (uid, expiryDate) => {
  try {
    const userDocRef = doc(db, "users", uid);
    await updateDoc(userDocRef, {
      isPremium: true,
      premiumExpiryDate: Timestamp.fromDate(expiryDate),
      updatedAt: Timestamp.now(),
    });
    return true;
  } catch (error) {
    console.error("Error setting premium status:", error);
    throw error;
  }
};

export const checkPremiumStatus = async (uid) => {
  try {
    const userProfile = await getUserProfile(uid);

    if (!userProfile || !userProfile.isPremium) {
      return false;
    }

    // Check if premium has expired
    const expiryDate = userProfile.premiumExpiryDate.toDate();
    const now = new Date();

    return expiryDate > now;
  } catch (error) {
    console.error("Error checking premium status:", error);
    return false;
  }
};

export default app;
