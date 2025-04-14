// context/AuthContext.js
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import {
  auth,
  getUserProfile,
  loginWithUsernameAndPassword,
  registerUser,
  logoutUser,
  updateUserProfile,
  changePassword,
} from "../lib/firebase";

// Auth context
const AuthContext = createContext({
  user: null,
  userProfile: null,
  loading: true,
  error: null,
  success: null,
  isPremium: false,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  updateProfile: async () => {},
  setError: () => {},
  setSuccess: () => {},
  clearError: () => {},
  clearSuccess: () => {},
  checkPremiumStatus: async () => {},
});

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [premiumExpiryDate, setPremiumExpiryDate] = useState(null);

  // Clear error
  const clearError = () => setError(null);

  // Clear success
  const clearSuccess = () => setSuccess(null);

  // Function to check if user's premium subscription is valid
  const checkPremiumStatus = async (userId) => {
    try {
      const targetUserId = userId || (user ? user.uid : null);

      if (!targetUserId) {
        // Try to check localStorage fallback for non-logged in users
        const isPremiumLocal = localStorage.getItem("premiumUser") === "true";
        const expiryDate = localStorage.getItem("premiumExpiry");

        if (isPremiumLocal && expiryDate) {
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
      }

      // Get user profile from Firestore
      const profile = await getUserProfile(targetUserId);

      if (!profile) {
        return { isPremium: false };
      }

      if (profile.isPremium === true && profile.premiumExpiryDate) {
        // Convert Firestore timestamp to JavaScript Date
        const expiryDate = profile.premiumExpiryDate.toDate();
        const now = new Date();

        // Check if premium is still valid
        if (expiryDate > now) {
          // Update state if checking current user
          if (targetUserId === user?.uid) {
            setIsPremium(true);
            setPremiumExpiryDate(expiryDate);
          }

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
          // Premium has expired
          if (targetUserId === user?.uid) {
            setIsPremium(false);
            setPremiumExpiryDate(null);
          }

          // Save premium status to localStorage for fallback
          localStorage.setItem("premiumUser", "false");
          localStorage.removeItem("premiumExpiry");

          return { isPremium: false };
        }
      }

      return { isPremium: false };
    } catch (error) {
      console.error("Error checking premium status:", error);
      return { isPremium: false, error: error.message };
    }
  };

  // Activate premium subscription
  const activatePremium = async (days = 30) => {
    try {
      if (!user?.uid) {
        setError("يجب تسجيل الدخول لتفعيل الاشتراك المميز");
        return {
          success: false,
          error: "يجب تسجيل الدخول لتفعيل الاشتراك المميز",
        };
      }

      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + days);

      // Update user profile in Firestore
      const result = await updateUserProfile(user.uid, {
        isPremium: true,
        premiumExpiryDate: expiryDate,
      });

      if (result.success) {
        // Update local state
        setIsPremium(true);
        setPremiumExpiryDate(expiryDate);
        setSuccess("تم تفعيل الاشتراك المميز بنجاح");

        // Save premium status to localStorage for fallback
        localStorage.setItem("premiumUser", "true");
        localStorage.setItem("premiumExpiry", expiryDate.toISOString());

        return {
          success: true,
          message: "تم تفعيل الاشتراك المميز بنجاح",
          expiryDate,
        };
      } else {
        setError(result.error || "فشل تفعيل الاشتراك المميز");
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error("Error activating premium:", error);
      setError("حدث خطأ أثناء تفعيل الاشتراك المميز");
      return { success: false, error: "حدث خطأ أثناء تفعيل الاشتراك المميز" };
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    if (!auth) return () => {};

    setLoading(true);

    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      try {
        if (authUser) {
          // User is logged in
          setUser(authUser);

          // Get user profile
          const profile = await getUserProfile(authUser.uid);
          if (profile) {
            setUserProfile(profile);

            // Check premium status
            if (profile.isPremium === true && profile.premiumExpiryDate) {
              const expiryDate = profile.premiumExpiryDate.toDate();
              const now = new Date();

              // Check if premium is still valid
              if (expiryDate > now) {
                setIsPremium(true);
                setPremiumExpiryDate(expiryDate);

                // Save premium status to localStorage for fallback
                localStorage.setItem("premiumUser", "true");
                localStorage.setItem("premiumExpiry", expiryDate.toISOString());
              } else {
                setIsPremium(false);
                setPremiumExpiryDate(null);

                // Save premium status to localStorage for fallback
                localStorage.setItem("premiumUser", "false");
                localStorage.removeItem("premiumExpiry");
              }
            }
          }
        } else {
          // User is logged out
          setUser(null);
          setUserProfile(null);
          setIsPremium(false);
          setPremiumExpiryDate(null);

          // Check if there's a locally saved premium status
          const isPremiumLocal = localStorage.getItem("premiumUser") === "true";
          const expiryDate = localStorage.getItem("premiumExpiry");

          if (isPremiumLocal && expiryDate) {
            const now = new Date();
            const expiry = new Date(expiryDate);

            if (now < expiry) {
              setIsPremium(true);
              setPremiumExpiryDate(expiry);
            } else {
              // Premium has expired
              localStorage.setItem("premiumUser", "false");
              localStorage.removeItem("premiumExpiry");
            }
          }
        }
      } catch (err) {
        console.error("Auth state change error:", err);
        setError("حدث خطأ أثناء تحميل بيانات المستخدم");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Login function
  const login = async (username, password) => {
    try {
      clearError();
      clearSuccess();
      setLoading(true);

      const result = await loginWithUsernameAndPassword(username, password);

      if (result.success) {
        setUser(result.user);
        setUserProfile(result.userData);

        // Check premium status
        if (result.userData?.isPremium && result.userData?.premiumExpiryDate) {
          const expiryDate = result.userData.premiumExpiryDate.toDate();
          const now = new Date();

          if (expiryDate > now) {
            setIsPremium(true);
            setPremiumExpiryDate(expiryDate);
          }
        }

        setSuccess("تم تسجيل الدخول بنجاح");
        return { success: true, user: result.userData };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      console.error("Login error:", err);
      const errorMessage = err.message || "حدث خطأ أثناء تسجيل الدخول";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      clearError();
      clearSuccess();
      setLoading(true);

      const result = await registerUser(userData);

      if (result.success) {
        setUser(result.user);
        setUserProfile(result.userData);
        setSuccess("تم إنشاء الحساب بنجاح");
        return { success: true, user: result.userData };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      console.error("Registration error:", err);
      const errorMessage = err.message || "حدث خطأ أثناء إنشاء الحساب";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      clearError();
      clearSuccess();
      setLoading(true);

      const result = await logoutUser();

      if (result.success) {
        setUser(null);
        setUserProfile(null);

        // Keep premium status if stored in localStorage (for non-logged in users)
        const isPremiumLocal = localStorage.getItem("premiumUser") === "true";
        const expiryDate = localStorage.getItem("premiumExpiry");

        if (isPremiumLocal && expiryDate) {
          const now = new Date();
          const expiry = new Date(expiryDate);

          if (now < expiry) {
            // Keep premium status active
          } else {
            // Premium has expired
            setIsPremium(false);
            setPremiumExpiryDate(null);
            localStorage.setItem("premiumUser", "false");
            localStorage.removeItem("premiumExpiry");
          }
        } else {
          setIsPremium(false);
          setPremiumExpiryDate(null);
        }

        setSuccess("تم تسجيل الخروج بنجاح");
        return true;
      } else {
        setError(result.error);
        return false;
      }
    } catch (err) {
      console.error("Logout error:", err);
      setError(err.message || "حدث خطأ أثناء تسجيل الخروج");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update profile function
  const updateProfile = async (profileData) => {
    try {
      clearError();
      clearSuccess();
      setLoading(true);

      if (!user?.uid) {
        setError("يجب تسجيل الدخول لتحديث الملف الشخصي");
        return {
          success: false,
          error: "يجب تسجيل الدخول لتحديث الملف الشخصي",
        };
      }

      // Handle password change separately
      if (profileData.newPassword) {
        const passwordResult = await changePassword(
          user,
          profileData.currentPassword,
          profileData.newPassword
        );

        if (!passwordResult.success) {
          setError(passwordResult.error);
          return { success: false, error: passwordResult.error };
        }

        // Remove password fields from profileData
        const { currentPassword, newPassword, ...otherData } = profileData;
        profileData = otherData;

        // If there's nothing else to update, return success
        if (Object.keys(profileData).length === 0) {
          setSuccess("تم تحديث كلمة المرور بنجاح");
          return { success: true, message: "تم تحديث كلمة المرور بنجاح" };
        }
      }

      // Update other profile data
      if (Object.keys(profileData).length > 0) {
        const result = await updateUserProfile(user.uid, profileData);

        if (result.success) {
          // Update local user profile
          const updatedProfile = await getUserProfile(user.uid);
          if (updatedProfile) {
            setUserProfile(updatedProfile);
          }

          setSuccess("تم تحديث الملف الشخصي بنجاح");
          return { success: true, message: "تم تحديث الملف الشخصي بنجاح" };
        } else {
          setError(result.error);
          return { success: false, error: result.error };
        }
      }

      return { success: true };
    } catch (err) {
      console.error("Profile update error:", err);
      const errorMessage = err.message || "حدث خطأ أثناء تحديث الملف الشخصي";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Context value
  const value = {
    user,
    userProfile,
    loading,
    error,
    success,
    isPremium,
    premiumExpiryDate,
    login,
    register,
    logout,
    updateProfile,
    setError,
    clearError,
    setSuccess,
    clearSuccess,
    activatePremium,
    checkPremiumStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
