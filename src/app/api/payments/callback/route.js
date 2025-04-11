// src/app/api/payments/callback/route.js
import { NextResponse } from "next/server";
import crypto from "crypto";

// Process Paymob webhook/callback
export async function POST(req) {
  try {
    // Get the request body
    const body = await req.json();
    console.log("Received payment callback:", JSON.stringify(body));

    // Validate HMAC if present
    const hmacSecret = process.env.PAYMOB_HMAC_SECRET;
    if (hmacSecret && body.hmac) {
      // The data to be secured by HMAC
      const { hmac, ...dataWithoutHmac } = body;

      // Sort the keys alphabetically
      const sortedKeys = Object.keys(dataWithoutHmac).sort();

      // Concatenate the values in order
      let concatenatedString = "";
      sortedKeys.forEach((key) => {
        if (
          dataWithoutHmac[key] !== null &&
          dataWithoutHmac[key] !== undefined
        ) {
          concatenatedString += dataWithoutHmac[key];
        }
      });

      // Calculate HMAC using SHA512
      const calculatedHmac = crypto
        .createHmac("sha512", hmacSecret)
        .update(concatenatedString)
        .digest("hex");

      // Verify HMAC
      if (hmac !== calculatedHmac) {
        console.error("HMAC validation failed");
        return NextResponse.json(
          { success: false, message: "HMAC validation failed" },
          { status: 401 }
        );
      }
    }

    // Extract important data from the callback
    const {
      amount_cents,
      order_id,
      success,
      is_refunded,
      is_capture,
      pending,
      integration_id,
      special_reference,
      token,
      data,
    } = body;

    // Store payment information in database (implement this later)
    // For now, we'll just log it
    console.log("Payment data to store:", {
      orderId: order_id,
      amount: amount_cents / 100,
      success,
      isRefunded: is_refunded,
      isCapture: is_capture,
      pending,
      integrationId: integration_id,
      specialReference: special_reference,
      token: token, // This will be the saved card token if user opted to save card
    });

    // Verify transaction success
    if (success === true && is_refunded === false) {
      // Payment successful
      console.log(
        "Payment successful for order:",
        order_id,
        "Amount:",
        amount_cents / 100,
        "EGP"
      );

      // In a real implementation, you'd store this info in a database
      // For now, we'll just return success
      return NextResponse.json({ success: true });
    } else if (pending === true) {
      // Payment is pending (e.g., Fawry)
      console.log(
        "Payment pending for order:",
        order_id,
        "Amount:",
        amount_cents / 100,
        "EGP"
      );

      return NextResponse.json({ success: true, status: "pending" });
    } else {
      // Payment failed or was refunded
      console.log("Payment failed/refunded for order:", order_id);

      return NextResponse.json({ success: false, status: "failed" });
    }
  } catch (error) {
    console.error("Error processing payment callback:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}

// For Paymob's transaction processed callback
export async function GET(req) {
  try {
    // Get query parameters
    const searchParams = req.nextUrl.searchParams;
    const success = searchParams.get("success");
    const orderId = searchParams.get("order_id");
    const intentionId = searchParams.get("intention_id");

    // Validate the callback
    if (!orderId && !intentionId) {
      return NextResponse.redirect(new URL("/premium?status=error", req.url));
    }

    if (success === "true") {
      // Successful payment - redirect to success page
      return NextResponse.redirect(
        new URL(
          `/premium?status=success&order_id=${orderId || intentionId}`,
          req.url
        )
      );
    } else {
      // Failed payment - redirect to error page
      return NextResponse.redirect(new URL("/premium?status=error", req.url));
    }
  } catch (error) {
    console.error("Error processing transaction response:", error);
    return NextResponse.redirect(new URL("/premium?status=error", req.url));
  }
}
