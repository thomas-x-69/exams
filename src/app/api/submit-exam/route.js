// src/app/api/submit-exam/route.js
export async function POST(req) {
  try {
    const data = await req.json();

    // Get the Google Apps Script URL from environment variables
    const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;

    // Add browser info for tracking
    const userAgent = req.headers.get("user-agent") || "";
    const ipAddress =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "unknown";

    // Prepare the data for Google Sheets
    const examData = {
      name: data.name,
      subjectName: data.subjectName,
      organizationCode: data.organizationCode,
      totalScore: data.totalScore || 0,
      behavioralScore: data.phaseScores?.behavioral || 0,
      languageScore: data.phaseScores?.language_arabic || 0, // Using Arabic score as main language score
      knowledgeScore: data.phaseScores?.knowledge_iq || 0, // Using IQ score as main knowledge score
      specializationScore: data.phaseScores?.specialization || 0,
      subject: data.subject || "mail",
      ipAddress,
      userAgent,
    };

    // Send data to Google Script
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(examData),
    });

    // Check the response status
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Parse the response as text first
    const resultText = await response.text();

    // Attempt to parse as JSON
    let result;
    try {
      result = JSON.parse(resultText);
    } catch (error) {
      // Handle non-JSON response
      console.error("Non-JSON response from server:", resultText);
      throw new Error("Unexpected response format from server");
    }

    // Check the result status
    if (result.status === "success") {
      return Response.json({
        status: "success",
        message: "تم حفظ البيانات بنجاح",
      });
    } else {
      throw new Error(result.message || "Unknown error");
    }
  } catch (error) {
    console.error("Error submitting exam data:", error);
    return Response.json(
      { status: "error", message: "حدث خطأ أثناء حفظ البيانات" },
      { status: 500 }
    );
  }
}
