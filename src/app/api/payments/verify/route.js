// src/app/api/payments/verify/route.js
import { NextResponse } from "next/server";

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

    // In a real-world scenario, you would verify the payment with your
    // payment gateway here. For this example, we'll simulate a successful payment.

    // Simulated verification response - would normally come from payment gateway API
    const verificationResponse = {
      success: true,
      status: "paid",
      amount: 99,
      orderId: orderId || intentionId,
      verifiedByServer: true,
      paymentDate: new Date().toISOString(),
    };

    // For demonstration purposes, you can simulate different payment statuses:
    // 1. Success - orderId starts with "success"
    // 2. Pending - orderId starts with "pending"
    // 3. Failed - orderId starts with "failed"
    if (orderId?.startsWith("success") || Math.random() > 0.3) {
      return NextResponse.json({
        success: true,
        message: "Payment verified successfully",
        status: "paid",
        verifiedByServer: true,
        order: {
          id: orderId || intentionId,
          amount: 99,
          date: new Date().toISOString(),
        },
      });
    } else if (orderId?.startsWith("pending") || Math.random() > 0.7) {
      return NextResponse.json({
        success: false,
        message: "Payment is pending or not completed",
        status: "pending",
        referenceNumber: `REF-${orderId || intentionId}`,
      });
    } else {
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
