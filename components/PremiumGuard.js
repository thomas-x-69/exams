// components/PremiumGuard.js
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useClientAuth } from "../context/ClientAuthContext";

/**
 * A component to protect premium-only routes
 * Redirects to premium page when trying to access premium content without a subscription
 */
const PremiumGuard = ({ children }) => {
  const router = useRouter();
  const { isPremium, checkPremiumStatus, loading } = useClientAuth();
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const verifyPremiumStatus = async () => {
      try {
        // Verify premium status from latest data
        const premiumStatus = await checkPremiumStatus();

        if (!premiumStatus.isPremium) {
          // Not premium - redirect to premium subscription page
          router.replace("/premium");
        } else {
          // User has premium access - render the content
          setPageLoading(false);
        }
      } catch (error) {
        console.error("Error verifying premium status:", error);
        // If error, redirect to premium page as a fallback
        router.replace("/premium");
      }
    };

    // Wait for initial auth loading to complete
    if (!loading) {
      if (!isPremium) {
        // Quick check - if definitely not premium, redirect immediately
        router.replace("/premium");
      } else {
        // Otherwise do a thorough check (may have expired)
        verifyPremiumStatus();
      }
    }
  }, [isPremium, loading, router, checkPremiumStatus]);

  if (loading || pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 relative">
            <div className="absolute inset-0 border-4 border-yellow-500/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-yellow-500 rounded-full animate-spin"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <svg
                className="w-12 h-12 text-yellow-400"
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
          <div className="flex flex-col items-center">
            <p className="text-white text-xl font-bold mb-1">
              جاري التحقق من العضوية...
            </p>
            <div className="w-48 h-1.5 bg-slate-700 rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-yellow-500 animate-pulse"
                style={{ width: "60%" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If premium and not loading, render the protected content
  return isPremium ? children : null;
};

export default PremiumGuard;
