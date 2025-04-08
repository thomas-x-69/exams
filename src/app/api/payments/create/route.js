// src/app/api/payments/create/route.js
import { NextResponse } from "next/server";

// Paymob API endpoints
const PAYMOB_API_URL = "https://accept.paymob.com/api";
const AUTH_ENDPOINT = "/auth/tokens";
const ORDER_ENDPOINT = "/ecommerce/orders";
const PAYMENT_KEY_ENDPOINT = "/acceptance/payment_keys";

export async function POST(req) {
  try {
    // Extract data from request
    const data = await req.json();
    const { amount, planId, integrationId, paymentMethodId } = data;

    if (!amount || !planId || !integrationId || !paymentMethodId) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
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

    // Step 2: Create an order
    const orderResponse = await fetch(`${PAYMOB_API_URL}${ORDER_ENDPOINT}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        auth_token: authToken,
        delivery_needed: false,
        amount_cents: amount, // Paymob amounts are in cents (or piasters)
        currency: "EGP",
        items: [],
      }),
    });

    const orderData = await orderResponse.json();
    if (!orderData.id) {
      console.error("Failed to create order:", orderData);
      return NextResponse.json(
        { success: false, message: "Failed to create payment order" },
        { status: 500 }
      );
    }

    // Get the order ID
    const orderId = orderData.id;

    // Step 3: Get a payment key
    const paymentKeyResponse = await fetch(
      `${PAYMOB_API_URL}${PAYMENT_KEY_ENDPOINT}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          auth_token: authToken,
          amount_cents: amount,
          expiration: 3600, // 1 hour expiry
          order_id: orderId,
          billing_data: {
            apartment: "NA",
            email: "user@example.com", // You should replace this with the user's email
            floor: "NA",
            first_name: "NA",
            street: "NA",
            building: "NA",
            phone_number: "NA",
            shipping_method: "NA",
            postal_code: "NA",
            city: "NA",
            country: "NA",
            last_name: "NA",
            state: "NA",
          },
          currency: "EGP",
          integration_id: parseInt(integrationId),
        }),
      }
    );

    const paymentKeyData = await paymentKeyResponse.json();
    if (!paymentKeyData.token) {
      console.error("Failed to get payment key:", paymentKeyData);
      return NextResponse.json(
        { success: false, message: "Failed to initiate payment" },
        { status: 500 }
      );
    }

    // Get the payment token
    const paymentToken = paymentKeyData.token;

    // Step 4: Generate the appropriate payment URL based on the payment method
    let paymentUrl;
    let redirectUrl;
    const baseUrl = process.env.SITE_URL || "http://localhost:3000";

    // Add payment method specific logic
    switch (paymentMethodId) {
      case "fawry":
        // Fawry payment URL
        paymentUrl = `https://accept.paymob.com/api/acceptance/payments/pay?payment_token=${paymentToken}`;
        break;

      case "wallet":
        // Mobile wallet payment URL
        paymentUrl = `https://accept.paymob.com/api/acceptance/payments/pay?payment_token=${paymentToken}`;
        break;

      case "credit":
        // Card payment URL (iframe)
        paymentUrl = `https://accept.paymob.com/api/acceptance/iframes/${process.env.PAYMOB_IFRAME_ID}?payment_token=${paymentToken}`;
        break;

      default:
        return NextResponse.json(
          { success: false, message: "Unsupported payment method" },
          { status: 400 }
        );
    }

    // Success callback URL - this is where Paymob will redirect after payment
    redirectUrl = `${baseUrl}/premium?status=success`;

    return NextResponse.json({
      success: true,
      paymentUrl,
      redirectUrl,
      order: {
        id: orderId,
        amount: amount / 100, // Convert back to EGP
        planId,
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

// Handle OPTIONS requests for CORS
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}
