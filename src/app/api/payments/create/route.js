// src/app/api/payments/create/route.js
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // Extract data from request
    const data = await req.json();
    const { amount, planId, userInfo } = data;

    // Validate required fields
    if (!amount || !planId) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // In a real-world scenario, you would create a payment session with your
    // payment gateway here. For this example, we'll simulate a payment session.

    // Generate a unique order ID
    const orderId = `order_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 10)}`;

    // Generate a fake payment iframe URL
    // In a real implementation, this would be a URL provided by your payment gateway
    // For example, Stripe Checkout or PayPal Checkout URL
    const iframeUrl = `/payment-simulator.html?order_id=${orderId}&amount=${amount}&plan=${planId}`;

    // For demonstration purposes, you can redirect to payment confirmation page after 5 seconds
    // In a real implementation, the payment gateway would handle this

    return NextResponse.json({
      success: true,
      message: "Payment session created successfully",
      orderId,
      iframeUrl,
      paymentToken: `token_${orderId}`,
      amount,
      planId,
      userInfo: {
        name: userInfo?.name || "Guest User",
        email: userInfo?.email || "guest@example.com",
        phone: userInfo?.phone || "01000000000",
        uid: userInfo?.uid || "guest",
      },
    });
  } catch (error) {
    console.error("Payment creation error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
