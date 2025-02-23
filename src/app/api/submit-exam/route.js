// src/app/api/submit-exam/route.js
export async function POST(req) {
  try {
    const data = await req.json();

    const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;

    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: data.name,
        subjectName: data.subjectName,
        organizationCode: data.organizationCode,
      }),
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
