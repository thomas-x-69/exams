// components/PremiumGuard.js
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { checkPremiumStatus } from "../utils/premiumService";

/**
 * A component to protect premium-only routes
 * Wrap any premium content with this component
 */
const PremiumGuard = ({ children }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    // Check premium status
    const checkAccess = () => {
      try {
        const hasPremium = checkPremiumStatus();
        setIsPremium(hasPremium);

        // If not premium, redirect to premium page
        if (!hasPremium) {
          router.replace("/premium");
        }
      } catch (error) {
        console.error("Error checking premium access:", error);
        router.replace("/premium");
      } finally {
        setLoading(false);
      }
    };

    // Run check on component mount
    checkAccess();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute top-0 left-0 w-full h-full border-8 border-yellow-500/20 rounded-full"></div>
            <div className="absolute top-0 left-0 w-full h-full border-8 border-t-yellow-500 rounded-full animate-spin"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-yellow-400 text-xl">
              <svg
                className="w-12 h-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
          </div>
          <p className="text-white text-xl font-bold">
            جاري التحقق من العضوية...
          </p>
        </div>
      </div>
    );
  }

  // If premium, render the protected content
  return isPremium ? children : null;
};

export default PremiumGuard;
