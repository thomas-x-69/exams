// context/ClientAuthContext.js
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { AuthProvider, useAuth } from "./AuthContext";
import { useToast } from "../components/ToastNotification";

// Create a context with the same interface as the old one
const ClientAuthContext = createContext({
  user: null,
  userProfile: null,
  loading: true,
  isPremium: false,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

// Wrapper component that connects AuthProvider with toast notifications
const ClientAuthWrapper = ({ children }) => {
  const { error, success, clearError, clearSuccess, loading } = useAuth();
  const toast = useToast();
  const [hasShownInitialError, setHasShownInitialError] = useState(false);

  // Handle Firebase initialization errors through toasts
  useEffect(() => {
    // Show Firebase initialization error only once on initial load
    if (loading === false && !hasShownInitialError) {
      const firebaseError = localStorage.getItem("_firebase_init_error");
      if (firebaseError) {
        toast.showError("مشكلة في خدمات تسجيل الدخول. يرجى المحاولة لاحقاً");
        setHasShownInitialError(true);
      }
    }
  }, [loading, toast, hasShownInitialError]);

  // Show toast notifications for auth errors and success messages
  useEffect(() => {
    if (error) {
      toast.showError(error);
      clearError();
    }
  }, [error, toast, clearError]);

  useEffect(() => {
    if (success) {
      toast.showSuccess(success);
      clearSuccess();
    }
  }, [success, toast, clearSuccess]);

  return <>{children}</>;
};

// Provider component passes through to AuthProvider with toast integration
export const ClientAuthProvider = ({ children }) => {
  return (
    <AuthProvider>
      <ClientAuthWrapper>{children}</ClientAuthWrapper>
    </AuthProvider>
  );
};

// The hook now simply uses the new useAuth hook
export const useClientAuth = () => {
  return useAuth();
};

export default ClientAuthContext;
