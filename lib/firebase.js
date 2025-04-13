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

// Login function
export const loginWithUsernameAndPassword = async (username, password) => {
  try {
    // Validation
    if (!username || !password) {
      return { success: false, error: "يرجى إدخال اسم المستخدم وكلمة المرور" };
    }

    if (!auth || !db) {
      return { success: false, error: "خطأ في الاتصال بالخادم" };
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

      return { success: true, user: authUser, userData: userProfile || user };
    } catch (authError) {
      console.error("Firebase auth error:", authError);

      if (authError.code === "auth/wrong-password") {
        return { success: false, error: "كلمة المرور غير صحيحة" };
      } else if (authError.code === "auth/too-many-requests") {
        return { success: false, error: "عدد محاولات كثيرة. حاول لاحقاً" };
      }

      return { success: false, error: "فشل تسجيل الدخول" };
    }
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "حدث خطأ غير متوقع" };
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
      return { success: false, error: "خطأ في الاتصال بالخادم" };
    }

    // Check if username already exists
    const existingUser = await findUserByUsername(userData.username).catch(
      () => null
    );
    if (existingUser) {
      return { success: false, error: "اسم المستخدم مستخدم بالفعل" };
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
        isPremium: false,
      };

      await setDoc(doc(db, "users", user.uid), userProfile);

      return { success: true, user, userData: userProfile };
    } catch (authError) {
      console.error("Auth error during registration:", authError);

      if (authError.code === "auth/email-already-in-use") {
        return { success: false, error: "اسم المستخدم مستخدم بالفعل" };
      } else if (authError.code === "auth/weak-password") {
        return { success: false, error: "كلمة المرور ضعيفة جداً" };
      }

      return { success: false, error: "فشل إنشاء الحساب" };
    }
  } catch (error) {
    console.error("Registration error:", error);
    return { success: false, error: "حدث خطأ غير متوقع" };
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
    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    return { success: false, error: "فشل تسجيل الخروج" };
  }
};
