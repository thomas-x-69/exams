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
  const { isPremium, checkPremiumStatus, loading, userProfile } =
    useClientAuth();
  const [pageLoading, setPageLoading] = useState(true);
  const [verificationAttempted, setVerificationAttempted] = useState(false);

  useEffect(() => {
    // Set a timeout to prevent infinite loading if Firebase fails
    const timeoutId = setTimeout(() => {
      if (pageLoading && !verificationAttempted) {
        console.log(
          "Premium verification timed out, redirecting to premium page"
        );
        router.replace("/premium?timeout=true");
      }
    }, 5000); // 5 seconds timeout

    return () => clearTimeout(timeoutId);
  }, [pageLoading, verificationAttempted, router]);

  useEffect(() => {
    const verifyPremiumStatus = async () => {
      try {
        setVerificationAttempted(true);

        // First check localStorage directly for a quick check
        const isPremiumLocal = localStorage.getItem("premiumUser") === "true";
        const expiryDate = localStorage.getItem("premiumExpiry");

        if (isPremiumLocal && expiryDate) {
          const now = new Date();
          const expiry = new Date(expiryDate);

          if (now < expiry) {
            // Valid premium from localStorage - allow access
            setPageLoading(false);
            return;
          }
        }

        // If not in localStorage or expired, check via the context
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
        router.replace("/premium?access=denied");
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
              {userProfile?.name
                ? `مرحباً ${userProfile.name}`
                : "جاري التحقق من العضوية..."}
            </p>
            <p className="text-white/70 text-sm mb-3">
              جاري التحقق من صلاحية الوصول للمحتوى المميز
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
