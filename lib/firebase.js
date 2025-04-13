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
  collection,
  query,
  where,
  getDocs,
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

// Session management constants
const SESSION_KEY = "auth_session";
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

// Save auth session to localStorage
const saveAuthSession = (user, userData) => {
  if (!user || !userData) return false;

  try {
    // Create session object with expiration
    const session = {
      userId: user.uid,
      username: userData.username,
      name: userData.name,
      token: user.accessToken || "session-token", // Use Firebase token if available
      expiresAt: Date.now() + SESSION_DURATION,
      createdAt: Date.now(),
    };

    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return true;
  } catch (error) {
    console.error("Error saving auth session:", error);
    return false;
  }
};

// Check if auth session is valid
export const checkAuthSession = () => {
  try {
    const sessionData = localStorage.getItem(SESSION_KEY);
    if (!sessionData) return null;

    const session = JSON.parse(sessionData);
    const now = Date.now();

    // Validate session expiration
    if (session.expiresAt < now) {
      // Session expired, clear it
      localStorage.removeItem(SESSION_KEY);
      return null;
    }

    // Return session user data (useful for quick access)
    return {
      uid: session.userId,
      username: session.username,
      name: session.name,
      isSessionUser: true, // Flag to indicate this is from session
    };
  } catch (error) {
    console.error("Error checking auth session:", error);
    return null;
  }
};

// Clear auth session
const clearAuthSession = () => {
  try {
    localStorage.removeItem(SESSION_KEY);
    return true;
  } catch (error) {
    console.error("Error clearing auth session:", error);
    return false;
  }
};

// Helper function to find a user by username
const findUserByUsername = async (username) => {
  try {
    // First check if we can get this from session
    const sessionUser = checkAuthSession();
    if (sessionUser && sessionUser.username === username) {
      return sessionUser;
    }

    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", username));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    // Get the first user with this username
    const userDoc = querySnapshot.docs[0];
    return {
      uid: userDoc.id,
      ...userDoc.data(),
    };
  } catch (error) {
    console.error("Error finding user by username:", error);
    return null;
  }
};

// Login function with username and password
export const loginWithUsernameAndPassword = async (username, password) => {
  try {
    // First check if this user is already in a valid session
    const sessionUser = checkAuthSession();
    if (sessionUser && sessionUser.username === username) {
      // User has a valid session, skip Firebase auth
      console.log("Using cached session for login");

      // Get full user profile for consistency
      const userProfile = await getUserProfile(sessionUser.uid);

      return { success: true, user: sessionUser, userData: userProfile };
    }

    // No valid session, proceed with normal authentication
    // Find user by username in Firestore
    const user = await findUserByUsername(username);

    if (!user || !user.email) {
      return { success: false, error: "اسم المستخدم غير موجود" };
    }

    // Use the email from the found user to authenticate with Firebase
    const userCredential = await signInWithEmailAndPassword(
      auth,
      user.email,
      password
    );
    const authUser = userCredential.user;

    // Get user profile from Firestore
    const userProfile = await getUserProfile(authUser.uid);

    // Save auth session for future use
    saveAuthSession(authUser, userProfile);

    // Save to localStorage for quicker access next time
    if (userProfile) {
      localStorage.setItem("user_data", JSON.stringify(userProfile));
    }

    return { success: true, user: authUser, userData: userProfile };
  } catch (error) {
    console.error("Login error:", error);

    let errorMessage =
      "فشل تسجيل الدخول. يرجى التحقق من اسم المستخدم وكلمة المرور.";

    if (error.code === "auth/user-not-found") {
      errorMessage = "اسم المستخدم غير مسجل.";
    } else if (error.code === "auth/wrong-password") {
      errorMessage = "كلمة المرور غير صحيحة.";
    }

    return { success: false, error: errorMessage };
  }
};

// Check if username already exists
export const checkUsernameExists = async (username) => {
  try {
    const user = await findUserByUsername(username);
    return !!user;
  } catch (error) {
    console.error("Error checking username:", error);
    return false;
  }
};

// Register function
export const registerUser = async (userData) => {
  try {
    // Check if username already exists
    const usernameExists = await checkUsernameExists(userData.username);
    if (usernameExists) {
      return { success: false, error: "اسم المستخدم مستخدم بالفعل" };
    }

    // Generate a unique email using the username and domain
    // We're using this as Firebase Auth requires email
    const email = `${userData.username.toLowerCase()}@egyptianexams.com`;

    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      userData.password
    );
    const user = userCredential.user;

    // Save additional user data to Firestore
    const userProfile = {
      uid: user.uid,
      username: userData.username,
      name: userData.name || userData.username,
      phone: userData.phone || "",
      email: email,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      isPremium: false,
    };

    // Save to Firestore
    await setDoc(doc(db, "users", user.uid), userProfile);

    // Create auth session
    saveAuthSession(user, userProfile);

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
    // First check if we can get this from session
    const sessionUser = checkAuthSession();
    if (sessionUser && sessionUser.uid === userId) {
      // Try to get from localStorage as it might have more data
      const savedUserData = localStorage.getItem("user_data");
      if (savedUserData) {
        const userData = JSON.parse(savedUserData);
        // Check if data is fresh enough (less than 1 hour old)
        if (userData.uid === userId) {
          console.log("Using cached user profile");
          return userData;
        }
      }
    }

    // No valid cache, get from Firestore
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
        const userData = JSON.parse(savedUserData);
        if (userData.uid === userId) {
          return userData;
        }
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

// Check premium status
export const checkPremiumStatus = async (userId = null) => {
  try {
    // First check localStorage for quick response
    const isPremium = localStorage.getItem("premiumUser") === "true";
    const expiryDate = localStorage.getItem("premiumExpiry");

    if (isPremium && expiryDate) {
      const expiry = new Date(expiryDate);
      const now = new Date();

      if (now < expiry) {
        // Valid premium status in localStorage
        console.log("Using cached premium status");
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

    // No valid cache or expired, check Firebase if userId is provided
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

    // If we get here, the user is not premium
    localStorage.setItem("premiumUser", "false");
    localStorage.removeItem("premiumExpiry");
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

    // Clear session
    clearAuthSession();

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
