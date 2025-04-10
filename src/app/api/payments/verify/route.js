// src/app/api/payments/verify/route.js
import { NextResponse } from "next/server";

// Paymob API endpoints
const PAYMOB_API_URL = "https://accept.paymob.com/api";
const AUTH_ENDPOINT = "/auth/tokens";
const ORDER_ENDPOINT = "/ecommerce/orders";

export async function POST(req) {
  try {
    // Extract data from request
    const data = await req.json();
    const { orderId } = data;

    if (!orderId) {
      return NextResponse.json(
        { success: false, message: "Missing order ID" },
        { status: 400 }
      );
    }

    // Get API Key from environment variables
    const apiKey = process.env.PAYMOB_API_KEY;
    if (!apiKey) {
      console.error("Paymob API key is not defined");
      return NextResponse.json(
        { success: false, message: "Payment service configuration error" },
        { status: 500 }
      );
    }

    // Step 1: Authenticate with Paymob
    const authResponse = await fetch(`${PAYMOB_API_URL}${AUTH_ENDPOINT}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ api_key: apiKey }),
    });

    if (!authResponse.ok) {
      console.error("Paymob auth API error:", await authResponse.text());
      return NextResponse.json(
        {
          success: false,
          message: "Failed to authenticate with payment provider",
        },
        { status: 500 }
      );
    }

    const authData = await authResponse.json();
    if (!authData.token) {
      console.error("Failed to authenticate with Paymob:", authData);
      return NextResponse.json(
        {
          success: false,
          message: "Authentication with payment provider failed",
        },
        { status: 500 }
      );
    }

    // Get auth token
    const authToken = authData.token;

    // Step 2: Get order details
    const orderResponse = await fetch(
      `${PAYMOB_API_URL}${ORDER_ENDPOINT}/${orderId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    if (!orderResponse.ok) {
      console.error("Paymob order API error:", await orderResponse.text());
      return NextResponse.json(
        { success: false, message: "Failed to verify payment" },
        { status: 500 }
      );
    }

    const orderData = await orderResponse.json();

    if (!orderData || !orderData.id) {
      console.error("Failed to retrieve order:", orderData);
      return NextResponse.json(
        { success: false, message: "Failed to verify payment" },
        { status: 500 }
      );
    }

    // Check if order is paid
    const isPaid = orderData.paid_amount_cents > 0;
    const isDelivered = orderData.is_payment_delivered;

    console.log("Order verification results:", {
      orderId,
      isPaid,
      isDelivered,
      paidAmount: orderData.paid_amount_cents / 100,
      amountCents: orderData.amount_cents / 100,
    });

    if (isPaid) {
      // Order is paid, retrieve transaction details
      if (orderData.transactions && orderData.transactions.length > 0) {
        const latestTransaction = orderData.transactions[0]; // Most recent transaction

        // Get transaction status
        const isSuccessful = latestTransaction.success === true;
        const isPending = latestTransaction.pending === true;

        if (isSuccessful) {
          // Payment is confirmed successful
          return NextResponse.json({
            success: true,
            message: "Payment verified successfully",
            status: "paid",
            order: {
              id: orderData.id,
              amount: orderData.amount_cents / 100,
              date: orderData.created_at,
            },
            transaction: {
              id: latestTransaction.id,
              paymentMethod: latestTransaction.source_data?.type || "unknown",
            },
          });
        } else if (isPending) {
          // Payment is still pending
          return NextResponse.json({
            success: true,
            message: "Payment is pending",
            status: "pending",
            order: {
              id: orderData.id,
              amount: orderData.amount_cents / 100,
              date: orderData.created_at,
            },
          });
        } else {
          // Payment failed
          return NextResponse.json({
            success: false,
            message: "Payment failed or was declined",
            status: "failed",
          });
        }
      }

      // No transactions found
      return NextResponse.json({
        success: false,
        message: "No transaction records found",
        status: "unknown",
      });
    } else {
      // Order is not paid
      return NextResponse.json({
        success: false,
        message: "Payment not received",
        status: "unpaid",
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
