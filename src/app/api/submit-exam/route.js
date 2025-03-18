// src/app/api/submit-exam/route.js
import { rateLimit } from "../../../../utils/rate-limit";

// Create a rate limiter that allows 10 requests per minute per IP
const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute in milliseconds
  uniqueTokenPerInterval: 500, // Max 500 users per interval
  limit: 10, // 10 requests per interval
});

export async function POST(req) {
  try {
    // Get client IP for rate limiting
    const ip =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    // Apply rate limiting
    try {
      await limiter.check(ip);
    } catch (error) {
      console.warn(`Rate limit exceeded for IP: ${ip}`);
      return Response.json(
        {
          status: "error",
          message:
            "لقد تجاوزت الحد المسموح به من الطلبات. يرجى المحاولة مرة أخرى بعد دقيقة.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": "60",
            "X-RateLimit-Limit": "10",
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }

    // Process the request normally if rate limit is not exceeded
    const data = await req.json();
    console.log("Received data:", data);

    // Get the Google Apps Script URL
    const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;
    console.log("Using Google Script URL:", GOOGLE_SCRIPT_URL);

    if (!GOOGLE_SCRIPT_URL) {
      console.error("Missing Google Script URL");
      return Response.json(
        { status: "error", message: "Server configuration error" },
        { status: 500 }
      );
    }

    // Format the data exactly as the script expects
    const examData = {
      name: data.name || "",
      subjectName: data.subjectName || "",
      totalScore: data.totalScore || 0,
      behavioralScore: data.phaseScores?.behavioral || 0,
      languageScore: data.phaseScores?.language_arabic || 0,
      knowledgeScore: data.phaseScores?.knowledge_iq || 0,
      specializationScore: data.phaseScores?.specialization || 0,
    };

    console.log("Sending data to Google Script:", examData);

    // Direct fetch to the Google Apps Script with proper headers
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(examData),
      // Increase timeout and disable cache
      cache: "no-store",
      next: { revalidate: 0 },
    });

    console.log("Response status:", response.status);
    const resultText = await response.text();
    console.log("Response text:", resultText);

    // Try to parse response as JSON
    let result;
    try {
      result = JSON.parse(resultText);
      console.log("Parsed response:", result);
    } catch (error) {
      console.error("Failed to parse response as JSON:", error);
      return Response.json(
        { status: "error", message: "Invalid response from server" },
        { status: 500 }
      );
    }

    // Return the result
    return Response.json(result);
  } catch (error) {
    console.error("Error in submit-exam API route:", error);
    return Response.json(
      { status: "error", message: "Server error: " + error.message },
      { status: 500 }
    );
  }
}
