// src/app/utils/rate-limit.js

/**
 * Simple in-memory rate limiter
 */
export function rateLimit({ limit, interval, uniqueTokenPerInterval }) {
  const tokenCache = new Map();

  return {
    check: (token) => {
      const now = Date.now();
      const cacheKey = token;

      // Create new entry for this token if it doesn't exist
      if (!tokenCache.has(cacheKey)) {
        tokenCache.set(cacheKey, {
          tokens: [],
          createdAt: now,
        });
      }

      // Clean old tokens that have expired
      const tokenData = tokenCache.get(cacheKey);
      tokenData.tokens = tokenData.tokens.filter(
        (timestamp) => now - timestamp < interval
      );

      // Check if token limit is reached
      if (tokenData.tokens.length >= limit) {
        return Promise.reject(new Error("Rate limit exceeded"));
      }

      // Add current request to tokens
      tokenData.tokens.push(now);
      tokenCache.set(cacheKey, tokenData);

      // Clean up old tokens in the entire cache
      // This prevents the cache from growing indefinitely
      if (now - tokenData.createdAt > interval * 10) {
        // Check which caches are older than 10x the interval and remove them
        for (const [key, value] of tokenCache.entries()) {
          if (now - value.createdAt > interval * 10) {
            tokenCache.delete(key);
          }
        }
      }

      return Promise.resolve();
    },
  };
}
