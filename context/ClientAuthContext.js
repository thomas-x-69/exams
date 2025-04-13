// context/ClientAuthContext.js
"use client";

// This is a wrapper component to ensure backward compatibility with existing code
// It redirects all methods to the new AuthContext

import { useContext, createContext } from "react";
import { AuthProvider, useAuth } from "./AuthContext";

// Create a context with the same interface as the old one
const ClientAuthContext = createContext({
  user: null,
  userProfile: null,
  loading: true,
  isPremium: false,
  premiumExpiryDate: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  updateProfile: async () => {},
  activatePremium: async () => {},
  checkPremiumStatus: () => {},
});

// This provider component is a pass-through to AuthProvider
export const ClientAuthProvider = ({ children }) => {
  return <AuthProvider>{children}</AuthProvider>;
};

// The hook now simply uses the new useAuth hook
export const useClientAuth = () => {
  // Just use the new hook
  return useAuth();
};

export default ClientAuthContext;
