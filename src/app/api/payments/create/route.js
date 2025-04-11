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
    const { amount, planId, userInfo } = data;

    console.log("Payment request data:", { amount, planId, userInfo });

    // Validate required fields
    if (!amount || !planId) {
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
    console.log("Authenticating with Paymob...");
    const authResponse = await fetch(`${PAYMOB_API_URL}${AUTH_ENDPOINT}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ api_key: apiKey }),
    });

    if (!authResponse.ok) {
      const errorText = await authResponse.text();
      console.error("Paymob auth API error:", errorText);
      return NextResponse.json(
        {
          success: false,
          message: "Authentication failed with payment provider",
        },
        { status: 500 }
      );
    }

    const authData = await authResponse.json();
    const authToken = authData.token;
    console.log("Authentication successful");

    // Step 2: Create an order
    console.log("Creating order...");
    const orderResponse = await fetch(`${PAYMOB_API_URL}${ORDER_ENDPOINT}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        auth_token: authToken,
        delivery_needed: false,
        amount_cents: amount * 100, // convert to cents/piasters
        currency: "EGP",
        items: [
          {
            name: "العضوية الذهبية",
            amount_cents: amount * 100,
            description: "اشتراك مدى الحياة في منصة الاختبارات المصرية",
            quantity: 1,
          },
        ],
      }),
    });

    if (!orderResponse.ok) {
      const errorText = await orderResponse.text();
      console.error("Paymob order API error:", errorText);
      return NextResponse.json(
        { success: false, message: "Failed to create payment order" },
        { status: 500 }
      );
    }

    const orderData = await orderResponse.json();
    const orderId = orderData.id;
    console.log("Order created with ID:", orderId);

    // Step 3: Get a payment key
    console.log("Requesting payment key...");

    // Prepare billing data
    const billing_data = {
      apartment: "NA",
      email: userInfo?.email || "user@example.com",
      floor: "NA",
      first_name: userInfo?.name?.split(" ")[0] || "Guest",
      street: "NA",
      building: "NA",
      phone_number: userInfo?.phone || "01000000000",
      shipping_method: "NA",
      postal_code: "NA",
      city: "NA",
      country: "EG",
      last_name: userInfo?.name?.split(" ").slice(1).join(" ") || "User",
      state: "NA",
    };

    // Get integration ID from environment variables
    const integrationId = process.env.PAYMOB_INTEGRATION_ID;
    if (!integrationId) {
      console.error("Paymob integration ID is not defined");
      return NextResponse.json(
        { success: false, message: "Payment service configuration error" },
        { status: 500 }
      );
    }

    const paymentKeyResponse = await fetch(
      `${PAYMOB_API_URL}${PAYMENT_KEY_ENDPOINT}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          auth_token: authToken,
          amount_cents: amount * 100,
          expiration: 3600, // 1 hour
          order_id: orderId,
          billing_data: billing_data,
          currency: "EGP",
          integration_id: parseInt(integrationId, 10),
          lock_order_when_paid: true,
        }),
      }
    );

    if (!paymentKeyResponse.ok) {
      const errorText = await paymentKeyResponse.text();
      console.error("Paymob payment key API error:", errorText);
      return NextResponse.json(
        { success: false, message: "Failed to generate payment key" },
        { status: 500 }
      );
    }

    const paymentKeyData = await paymentKeyResponse.json();
    const paymentToken = paymentKeyData.token;
    console.log("Payment token generated successfully");

    // Create iframe URL with the payment token
    const iframeUrl = `https://accept.paymob.com/api/acceptance/iframes/911566?payment_token=${paymentToken}`;

    return NextResponse.json({
      success: true,
      iframeUrl,
      paymentToken,
      orderId,
      order: {
        id: orderId,
        amount: amount,
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
