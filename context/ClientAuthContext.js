// context/ClientAuthContext.js
"use client";

// This is a wrapper component for backward compatibility
import { useContext, createContext } from "react";
import { AuthProvider, useAuth } from "./AuthContext";

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

// Provider component passes through to AuthProvider
export const ClientAuthProvider = ({ children }) => {
  return <AuthProvider>{children}</AuthProvider>;
};

// The hook now simply uses the new useAuth hook
export const useClientAuth = () => {
  return useAuth();
};

export default ClientAuthContext;
