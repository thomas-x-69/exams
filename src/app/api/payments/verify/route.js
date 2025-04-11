// src/app/api/payments/verify/route.js
import { NextResponse } from "next/server";

// Paymob API endpoints
const PAYMOB_BASE_URL = "https://accept.paymob.com/api";
const PAYMOB_INTENTION_ENDPOINT = "/v1/intention/";

export async function POST(req) {
  try {
    // Extract data from request
    const data = await req.json();
    const { orderId, intentionId } = data;

    if (!orderId && !intentionId) {
      return NextResponse.json(
        { success: false, message: "Missing order ID or intention ID" },
        { status: 400 }
      );
    }

    // Get API Key from environment variables
    const secretKey = process.env.PAYMOB_SECRET_KEY;
    if (!secretKey) {
      console.error("Paymob Secret key is not defined");
      return NextResponse.json(
        { success: false, message: "Payment service configuration error" },
        { status: 500 }
      );
    }

    // Verify the payment intention status
    const verifyUrl = `${PAYMOB_BASE_URL}${PAYMOB_INTENTION_ENDPOINT}${
      intentionId || orderId
    }/`;

    const verifyResponse = await fetch(verifyUrl, {
      method: "GET",
      headers: {
        Authorization: `Token ${secretKey}`,
        "Content-Type": "application/json",
      },
    });

    if (!verifyResponse.ok) {
      console.error("Paymob verify API error:", await verifyResponse.text());
      return NextResponse.json(
        { success: false, message: "Failed to verify payment" },
        { status: 500 }
      );
    }

    const verifyData = await verifyResponse.json();

    // Check if payment is confirmed
    const isConfirmed = verifyData.confirmed === true;
    const status = verifyData.status;

    if (isConfirmed && status === "paid") {
      // Payment is confirmed
      return NextResponse.json({
        success: true,
        message: "Payment verified successfully",
        status: "paid",
        order: {
          id: verifyData.intention_order_id,
          amount: verifyData.intention_detail?.amount || 0,
          date: verifyData.created,
        },
        extras: verifyData.extras?.creation_extras || {},
      });
    } else if (status === "intended") {
      // Payment is still pending
      return NextResponse.json({
        success: false,
        message: "Payment is pending or not completed",
        status: "pending",
      });
    } else {
      // Payment failed or was declined
      return NextResponse.json({
        success: false,
        message: "Payment failed or was declined",
        status: "failed",
      });
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
