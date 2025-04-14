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

// Firebase configuration
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
    // Log the Firebase config to help debug (this won't expose sensitive data to users)
    console.log("Firebase Config Status:", {
      apiKeyExists: !!firebaseConfig.apiKey,
      authDomainExists: !!firebaseConfig.authDomain,
      projectIdExists: !!firebaseConfig.projectId,
      appIdExists: !!firebaseConfig.appId,
    });

    // Initialize Firebase with the config
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);

    // Keep user logged in between sessions
    setPersistence(auth, browserLocalPersistence).catch((error) => {
      console.error("Error setting auth persistence:", error);
    });
  } catch (error) {
    console.error("Firebase initialization error:", error);
  }
}

export { auth, db };

// Find user by username
const findUserByUsername = async (username) => {
  try {
    if (!db) {
      throw new Error("Firestore is not initialized");
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
    throw error;
  }
};

// Map Firebase error codes to user-friendly Arabic messages
const getErrorMessage = (errorCode) => {
  const errorMessages = {
    "auth/wrong-password": "كلمة المرور غير صحيحة",
    "auth/user-not-found": "اسم المستخدم غير موجود",
    "auth/too-many-requests":
      "تم إجراء عدة محاولات غير ناجحة. يرجى المحاولة لاحقاً",
    "auth/email-already-in-use": "اسم المستخدم مستخدم بالفعل",
    "auth/weak-password":
      "كلمة المرور ضعيفة جداً (يجب أن تكون 6 أحرف على الأقل)",
    "auth/network-request-failed":
      "خطأ في الاتصال بالشبكة. يرجى التحقق من اتصالك بالإنترنت",
    "auth/invalid-email": "صيغة البريد الإلكتروني غير صحيحة",
    "auth/invalid-api-key":
      "مشكلة في إعدادات التطبيق. يرجى التواصل مع الدعم الفني",
    "auth/user-disabled": "تم تعطيل هذا الحساب. يرجى التواصل مع الدعم الفني",
    "firestore/unavailable":
      "خدمة قاعدة البيانات غير متاحة حالياً. يرجى المحاولة لاحقاً",
    "firestore/permission-denied": "ليس لديك صلاحية للوصول لهذه البيانات",
  };

  return (
    errorMessages[errorCode] || "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى"
  );
};

// Login function
export const loginWithUsernameAndPassword = async (username, password) => {
  try {
    // Validation
    if (!username || !password) {
      return { success: false, error: "يرجى إدخال اسم المستخدم وكلمة المرور" };
    }

    if (!auth || !db) {
      return {
        success: false,
        error:
          "خطأ في الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى",
      };
    }

    // Find user by username
    const user = await findUserByUsername(username);

    if (!user || !user.email) {
      return { success: false, error: "اسم المستخدم غير موجود" };
    }

    // Login with Firebase auth
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        user.email,
        password
      );
      const authUser = userCredential.user;

      // Get user profile
      const userProfile = await getUserProfile(authUser.uid);

      // Save last login time
      try {
        await updateDoc(doc(db, "users", authUser.uid), {
          lastLoginAt: Timestamp.now(),
        });
      } catch (updateError) {
        // Non-critical error, just log it
        console.error("Error updating last login time:", updateError);
      }

      return {
        success: true,
        user: authUser,
        userData: userProfile || user,
        message: "تم تسجيل الدخول بنجاح",
      };
    } catch (authError) {
      console.error("Firebase auth error:", authError);
      return {
        success: false,
        error: getErrorMessage(authError.code),
      };
    }
  } catch (error) {
    console.error("Login error:", error);
    // Determine if it's a network error
    const isNetworkError =
      error.message?.includes("network") ||
      error.code?.includes("network") ||
      !navigator.onLine;

    return {
      success: false,
      error: isNetworkError
        ? "خطأ في الاتصال بالشبكة. يرجى التحقق من اتصالك بالإنترنت"
        : "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى",
    };
  }
};

// Register function
export const registerUser = async (userData) => {
  try {
    // Validation
    if (!userData.username || !userData.password) {
      return { success: false, error: "يجب إدخال اسم المستخدم وكلمة المرور" };
    }

    if (!auth || !db) {
      return {
        success: false,
        error:
          "خطأ في الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى",
      };
    }

    // Check if username already exists
    const existingUser = await findUserByUsername(userData.username).catch(
      () => null
    );
    if (existingUser) {
      return {
        success: false,
        error: "اسم المستخدم مستخدم بالفعل. يرجى اختيار اسم مستخدم آخر",
      };
    }

    // Generate an email from username
    const email = `${userData.username.toLowerCase()}@egyptianexams.com`;

    // Create user in Firebase Auth
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        userData.password
      );
      const user = userCredential.user;

      // Save user data to Firestore
      const userProfile = {
        uid: user.uid,
        username: userData.username,
        name: userData.name || userData.username,
        phone: userData.phone || "",
        email: email,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        lastLoginAt: Timestamp.now(),
        isPremium: false,
      };

      await setDoc(doc(db, "users", user.uid), userProfile);

      return {
        success: true,
        user,
        userData: userProfile,
        message: "تم إنشاء الحساب بنجاح",
      };
    } catch (authError) {
      console.error("Auth error during registration:", authError);
      return {
        success: false,
        error: getErrorMessage(authError.code),
      };
    }
  } catch (error) {
    console.error("Registration error:", error);
    // Determine if it's a network error
    const isNetworkError =
      error.message?.includes("network") ||
      error.code?.includes("network") ||
      !navigator.onLine;

    return {
      success: false,
      error: isNetworkError
        ? "خطأ في الاتصال بالشبكة. يرجى التحقق من اتصالك بالإنترنت"
        : "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى",
    };
  }
};

// Update user profile
export const updateUserProfile = async (userId, profileData) => {
  try {
    if (!userId || !db) {
      return { success: false, error: "معلومات المستخدم غير متوفرة" };
    }

    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      return { success: false, error: "المستخدم غير موجود" };
    }

    // Update the profile
    await updateDoc(userRef, {
      ...profileData,
      updatedAt: Timestamp.now(),
    });

    return {
      success: true,
      message: "تم تحديث الملف الشخصي بنجاح",
    };
  } catch (error) {
    console.error("Error updating user profile:", error);
    return {
      success: false,
      error: "حدث خطأ أثناء تحديث الملف الشخصي",
    };
  }
};

// Get user profile from Firestore
export const getUserProfile = async (userId) => {
  try {
    if (!userId || !db) return null;

    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      return userDoc.data();
    }
    return null;
  } catch (error) {
    console.error("Error getting user profile:", error);
    return null;
  }
};

// Logout function
export const logoutUser = async () => {
  try {
    if (auth) {
      await signOut(auth);
    }
    return { success: true, message: "تم تسجيل الخروج بنجاح" };
  } catch (error) {
    console.error("Logout error:", error);
    return {
      success: false,
      error: "فشل تسجيل الخروج. يرجى المحاولة مرة أخرى",
    };
  }
};

// Change password
export const changePassword = async (user, currentPassword, newPassword) => {
  try {
    if (!user || !auth) {
      return { success: false, error: "يجب تسجيل الدخول أولاً" };
    }

    // Re-authenticate user (required for changing password)
    try {
      // This is a simplified example - in a real app you'd need to re-authenticate
      await updatePassword(user, newPassword);

      return {
        success: true,
        message: "تم تغيير كلمة المرور بنجاح",
      };
    } catch (authError) {
      console.error("Auth error during password change:", authError);
      return {
        success: false,
        error: getErrorMessage(authError.code) || "فشل تغيير كلمة المرور",
      };
    }
  } catch (error) {
    console.error("Password change error:", error);
    return {
      success: false,
      error: "حدث خطأ أثناء تغيير كلمة المرور",
    };
  }
};
