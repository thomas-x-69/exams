// src/app/api/payments/create/route.js
import { NextResponse } from "next/server";

// Paymob API endpoints - using the correct domain as in your dashboard
const PAYMOB_API_URL = "https://accept.paymobsolutions.com/api";
const AUTH_ENDPOINT = "/auth/tokens";
const ORDER_ENDPOINT = "/ecommerce/orders";
const PAYMENT_KEY_ENDPOINT = "/acceptance/payment_keys";

export async function POST(req) {
  try {
    // Extract data from request
    const data = await req.json();
    const {
      amount,
      planId,
      integrationId,
      iframeId,
      paymentMethodId,
      userInfo,
    } = data;

    console.log("Payment request data:", {
      amount,
      planId,
      integrationId,
      iframeId,
      paymentMethodId,
    });

    // Validate required fields
    if (!amount || !planId || !paymentMethodId) {
      console.error("Missing required fields");
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

    console.log("API Key available:", !!apiKey);

    // Step 1: Authenticate with Paymob
    try {
      console.log("Authenticating with Paymob...");
      const authResponse = await fetch(`${PAYMOB_API_URL}${AUTH_ENDPOINT}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ api_key: apiKey }),
      });

      // Get full text response for debugging
      const responseText = await authResponse.text();
      console.log("Auth response status:", authResponse.status);
      console.log(
        "Auth response text (preview):",
        responseText.substring(0, 200) + "..."
      );

      // Parse as JSON
      let authData;
      try {
        authData = JSON.parse(responseText);
      } catch (e) {
        console.error("Failed to parse auth response as JSON:", e);
        return NextResponse.json(
          { success: false, message: "Invalid response from payment provider" },
          { status: 500 }
        );
      }

      if (!authData.token) {
        console.error("No token in auth response:", authData);
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
      console.log("Successfully authenticated with Paymob");

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
          amount_cents: amount, // Paymob amounts are in cents (or piasters)
          currency: "EGP",
          items: [
            {
              name: "العضوية الذهبية",
              amount_cents: amount,
              description: "اشتراك مدى الحياة في منصة الاختبارات المصرية",
              quantity: "1",
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
      if (!orderData.id) {
        console.error("Failed to create order:", orderData);
        return NextResponse.json(
          { success: false, message: "Failed to create payment order" },
          { status: 500 }
        );
      }

      // Get the order ID
      const orderId = orderData.id;
      console.log("Order created with ID:", orderId);

      // Prepare billing data
      const billing_data = {
        apartment: "NA",
        email: userInfo?.email || "user@example.com",
        floor: "NA",
        first_name: userInfo?.name?.split(" ")[0] || "NA",
        street: "NA",
        building: "NA",
        phone_number: userInfo?.phone || "NA",
        shipping_method: "NA",
        postal_code: "NA",
        city: "NA",
        country: "EG",
        last_name: userInfo?.name?.split(" ").slice(1).join(" ") || "NA",
        state: "NA",
      };

      // Step 3: Get a payment key
      console.log("Requesting payment key...");
      const paymentKeyRequestBody = {
        auth_token: authToken,
        amount_cents: amount,
        expiration: 3600, // 1 hour expiry
        order_id: orderId,
        billing_data: billing_data,
        currency: "EGP",
        integration_id: parseInt(integrationId, 10), // Ensure it's a number
      };

      console.log("Payment key request body:", paymentKeyRequestBody);

      const paymentKeyResponse = await fetch(
        `${PAYMOB_API_URL}${PAYMENT_KEY_ENDPOINT}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(paymentKeyRequestBody),
        }
      );

      if (!paymentKeyResponse.ok) {
        const errorText = await paymentKeyResponse.text();
        console.error("Paymob payment key API error:", errorText);
        return NextResponse.json(
          { success: false, message: "Failed to initiate payment" },
          { status: 500 }
        );
      }

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
      console.log("Received payment token");

      // Create iframe URL
      const iframeUrl = `https://accept.paymobsolutions.com/api/acceptance/iframes/${
        iframeId || 911567
      }?payment_token=${paymentToken}`;
      console.log("Generated iframe URL");

      return NextResponse.json({
        success: true,
        iframeUrl,
        order: {
          id: orderId,
          amount: amount / 100, // Convert back to EGP
          planId,
        },
      });
    } catch (error) {
      console.error("Error during Paymob API communication:", error);
      return NextResponse.json(
        {
          success: false,
          message: "Failed to communicate with payment provider",
        },
        { status: 500 }
      );
    }
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
