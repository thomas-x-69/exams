// context/ClientAuthContext.js
"use client";

import { createContext, useContext, useEffect } from "react";
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
  const { error, success, clearError, clearSuccess } = useAuth();
  const toast = useToast();

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
