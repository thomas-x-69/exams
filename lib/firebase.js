// lib/firebase.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updatePassword,
  signOut,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";

// Your Firebase configuration
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

// Check if we're in browser environment
if (typeof window !== "undefined") {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);

    // Set persistence to LOCAL to keep the user logged in for a week
    setPersistence(auth, browserLocalPersistence).catch((error) => {
      console.error("Error setting persistence:", error);
    });
  } catch (error) {
    console.error("Firebase initialization error:", error);
  }
}

export { auth, db };

// Login function with email and password
export const loginWithEmailAndPassword = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Get user profile from Firestore
    const userProfile = await getUserProfile(user.uid);

    // Save to localStorage for quicker access next time
    if (userProfile) {
      localStorage.setItem("user_data", JSON.stringify(userProfile));
    }

    return { success: true, user, userData: userProfile };
  } catch (error) {
    console.error("Login error:", error);

    let errorMessage =
      "فشل تسجيل الدخول. يرجى التحقق من البريد الإلكتروني وكلمة المرور.";

    if (error.code === "auth/user-not-found") {
      errorMessage = "البريد الإلكتروني غير مسجل.";
    } else if (error.code === "auth/wrong-password") {
      errorMessage = "كلمة المرور غير صحيحة.";
    }

    return { success: false, error: errorMessage };
  }
};

// Register function
export const registerUser = async (userData) => {
  try {
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      userData.email,
      userData.password
    );
    const user = userCredential.user;

    // Save additional user data to Firestore
    const userProfile = {
      uid: user.uid,
      name: userData.name,
      email: userData.email,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      isPremium: false,
    };

    // Save to Firestore
    await setDoc(doc(db, "users", user.uid), userProfile);

    // Save to localStorage for quicker access next time
    localStorage.setItem("user_data", JSON.stringify(userProfile));

    return { success: true, user, userData: userProfile };
  } catch (error) {
    console.error("Registration error:", error);

    let errorMessage = "فشل إنشاء الحساب. يرجى المحاولة مرة أخرى.";

    if (error.code === "auth/email-already-in-use") {
      errorMessage = "البريد الإلكتروني مستخدم بالفعل.";
    }

    return { success: false, error: errorMessage };
  }
};

// Get user profile from Firestore
export const getUserProfile = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();

      // Save to localStorage for quicker access next time
      localStorage.setItem("user_data", JSON.stringify(userData));

      return userData;
    }

    return null;
  } catch (error) {
    console.error("Error getting user profile:", error);

    // Try to get from localStorage as a fallback
    try {
      const savedUserData = localStorage.getItem("user_data");
      if (savedUserData) {
        return JSON.parse(savedUserData);
      }
    } catch (e) {
      console.error("Error getting user data from localStorage:", e);
    }

    return null;
  }
};

// Update user profile in Firestore
export const updateUserProfile = async (userId, userData) => {
  try {
    const userRef = doc(db, "users", userId);

    // Get current data
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      return { success: false, error: "المستخدم غير موجود" };
    }

    // Prepare update data
    const updateData = {
      ...userData,
      updatedAt: Timestamp.now(),
    };

    // If updating password
    if (userData.newPassword) {
      // Update password in Auth
      try {
        if (auth.currentUser) {
          await updatePassword(auth.currentUser, userData.newPassword);
        }

        // Remove newPassword from data to be stored
        delete updateData.newPassword;
      } catch (passwordError) {
        console.error("Error updating password:", passwordError);
        return {
          success: false,
          error:
            "فشل تحديث كلمة المرور. يرجى إعادة تسجيل الدخول والمحاولة مرة أخرى.",
        };
      }
    }

    // Update in Firestore
    await updateDoc(userRef, updateData);

    // Update localStorage
    const savedUserData = localStorage.getItem("user_data");
    if (savedUserData) {
      const parsedData = JSON.parse(savedUserData);
      const updatedData = { ...parsedData, ...updateData };
      localStorage.setItem("user_data", JSON.stringify(updatedData));
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating user profile:", error);
    return { success: false, error: error.message };
  }
};

// Set premium status in Firestore
export const setPremiumStatus = async (userId, expiryDate) => {
  try {
    if (!userId) {
      // Just update localStorage if no userId provided
      localStorage.setItem("premiumUser", "true");
      localStorage.setItem("premiumExpiry", expiryDate.toISOString());
      return { success: true };
    }

    const userRef = doc(db, "users", userId);

    // Update in Firestore
    await updateDoc(userRef, {
      isPremium: true,
      premiumExpiryDate: Timestamp.fromDate(expiryDate),
      updatedAt: Timestamp.now(),
    });

    // Update localStorage
    localStorage.setItem("premiumUser", "true");
    localStorage.setItem("premiumExpiry", expiryDate.toISOString());

    return { success: true };
  } catch (error) {
    console.error("Error setting premium status:", error);
    return { success: false, error: error.message };
  }
};

// Check premium status in Firestore
export const checkPremiumStatus = async (userId) => {
  try {
    // Check Firebase if userId is provided
    if (userId) {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();

        if (userData.isPremium && userData.premiumExpiryDate) {
          const expiryDate = userData.premiumExpiryDate.toDate();
          const now = new Date();

          if (expiryDate > now) {
            // Still valid, update localStorage
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
            // Expired, update both Firebase and localStorage
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
    }

    // Fallback to localStorage
    const isPremium = localStorage.getItem("premiumUser") === "true";
    const expiryDate = localStorage.getItem("premiumExpiry");

    if (isPremium && expiryDate) {
      const expiry = new Date(expiryDate);
      const now = new Date();

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

      // Expired
      localStorage.setItem("premiumUser", "false");
      localStorage.removeItem("premiumExpiry");
    }

    return { isPremium: false };
  } catch (error) {
    console.error("Error checking premium status:", error);
    return { isPremium: false, error: error.message };
  }
};

// Logout function
export const logoutUser = async (preservePremium = true) => {
  try {
    if (auth) {
      await signOut(auth);
    }

    // Clear user data from localStorage, but keep premium status if requested
    localStorage.removeItem("user_data");

    if (!preservePremium) {
      localStorage.removeItem("premiumUser");
      localStorage.removeItem("premiumExpiry");
    }

    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    return { success: false, error: error.message };
  }
};
