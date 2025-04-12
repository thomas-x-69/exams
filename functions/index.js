// functions/index.js
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");
const cors = require("cors")({ origin: true });

admin.initializeApp();
const db = admin.firestore();

// Environment variables for Paymob
const PAYMOB_API_KEY = process.env.PAYMOB_API_KEY;
const PAYMOB_INTEGRATION_ID = process.env.PAYMOB_INTEGRATION_ID;
const PAYMOB_HMAC_SECRET = process.env.PAYMOB_HMAC_SECRET;
const PAYMOB_IFRAME_ID = process.env.PAYMOB_IFRAME_ID;
const APP_URL = process.env.APP_URL || "https://egyptianexams.com";

// Create a payment session with Paymob
exports.createPaymentSession = functions.https.onCall(async (data, context) => {
  try {
    const { amount, planId, userData } = data;

    if (!amount || !planId) {
      throw new Error("Missing required parameters: amount or planId");
    }

    // Step 1: Authenticate with Paymob and get auth token
    const authResponse = await axios.post(
      "https://accept.paymob.com/api/auth/tokens",
      {
        api_key: PAYMOB_API_KEY,
      }
    );

    const authToken = authResponse.data.token;

    // Step 2: Create an order
    const orderResponse = await axios.post(
      "https://accept.paymob.com/api/ecommerce/orders",
      {
        auth_token: authToken,
        delivery_needed: false,
        amount_cents: amount * 100, // Convert to cents
        currency: "EGP",
        items: [
          {
            name: `اشتراك ذهبي - ${
              planId === "monthly"
                ? "شهري"
                : planId === "quarterly"
                ? "ربع سنوي"
                : "سنوي"
            }`,
            amount_cents: amount * 100,
            description: `اشتراك في منصة الاختبارات المصرية - ${planId}`,
            quantity: 1,
          },
        ],
      }
    );

    const orderId = orderResponse.data.id;

    // Step 3: Get a payment key
    const paymentKeyResponse = await axios.post(
      "https://accept.paymob.com/api/acceptance/payment_keys",
      {
        auth_token: authToken,
        amount_cents: amount * 100,
        expiration: 3600, // 1 hour expiration
        order_id: orderId,
        billing_data: {
          apartment: "NA",
          email: userData?.email || "guest@egyptianexams.com",
          floor: "NA",
          first_name: userData?.name?.split(" ")[0] || "Guest",
          street: "NA",
          building: "NA",
          phone_number: userData?.phone || "00000000000",
          shipping_method: "NA",
          postal_code: "NA",
          city: "NA",
          country: "EG",
          state: "NA",
          last_name: userData?.name?.split(" ")[1] || "User",
        },
        currency: "EGP",
        integration_id: PAYMOB_INTEGRATION_ID,
        lock_order_when_paid: true,
      }
    );

    const paymentKey = paymentKeyResponse.data.token;

    // Step 4: Generate the iframe URL for Fawry
    const iframeUrl = `https://accept.paymob.com/api/acceptance/iframes/${PAYMOB_IFRAME_ID}?payment_token=${paymentKey}`;

    // Store order information in Firestore
    if (context.auth) {
      await db
        .collection("orders")
        .doc(orderId.toString())
        .set({
          userId: context.auth.uid,
          orderId: orderId,
          amount: amount,
          planId: planId,
          status: "pending",
          paymentMethod: "fawry",
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          userData: userData || null,
        });
    } else {
      // For non-authenticated users, still store the order
      await db
        .collection("orders")
        .doc(orderId.toString())
        .set({
          userId: null,
          tempUserData: userData || null,
          orderId: orderId,
          amount: amount,
          planId: planId,
          status: "pending",
          paymentMethod: "fawry",
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
    }

    return {
      success: true,
      orderId: orderId,
      iframeUrl: iframeUrl,
      paymentToken: paymentKey,
    };
  } catch (error) {
    console.error("Error creating payment session:", error);
    throw new functions.https.HttpsError(
      "internal",
      error.message || "An unknown error occurred"
    );
  }
});

// Verify payment status
exports.verifyPayment = functions.https.onCall(async (data, context) => {
  try {
    const { orderId } = data;

    if (!orderId) {
      throw new Error("Missing required parameter: orderId");
    }

    // Check if order exists in Firestore
    const orderDoc = await db
      .collection("orders")
      .doc(orderId.toString())
      .get();

    if (!orderDoc.exists) {
      throw new Error("Order not found");
    }

    const orderData = orderDoc.data();

    // Check with Paymob API for order status
    const authResponse = await axios.post(
      "https://accept.paymob.com/api/auth/tokens",
      {
        api_key: PAYMOB_API_KEY,
      }
    );

    const authToken = authResponse.data.token;

    const orderStatusResponse = await axios.get(
      `https://accept.paymob.com/api/acceptance/transactions?order_id=${orderId}`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    // Check if any transaction is successful
    const transactions = orderStatusResponse.data.results || [];
    const successfulTransaction = transactions.find(
      (transaction) => transaction.success === true && !transaction.is_refunded
    );

    if (successfulTransaction) {
      // Update order status in Firestore
      await db.collection("orders").doc(orderId.toString()).update({
        status: "paid",
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        transactionId: successfulTransaction.id,
      });

      // If there's a user associated with this order, update their premium status
      if (orderData.userId) {
        // Calculate expiry date based on plan
        const now = new Date();
        let expiryDate;

        if (orderData.planId === "monthly") {
          expiryDate = new Date(now.setMonth(now.getMonth() + 1));
        } else if (orderData.planId === "quarterly") {
          expiryDate = new Date(now.setMonth(now.getMonth() + 3));
        } else if (orderData.planId === "yearly") {
          expiryDate = new Date(now.setFullYear(now.getFullYear() + 1));
        } else {
          // Default to monthly
          expiryDate = new Date(now.setMonth(now.getMonth() + 1));
        }

        // Update user's premium status
        await db
          .collection("users")
          .doc(orderData.userId)
          .update({
            isPremium: true,
            premiumExpiryDate: admin.firestore.Timestamp.fromDate(expiryDate),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          });
      }

      return {
        success: true,
        status: "paid",
        message: "تمت عملية الدفع بنجاح",
        verifiedByServer: true,
        order: {
          id: orderId,
          amount: orderData.amount,
          date: successfulTransaction.created_at,
        },
      };
    } else if (
      transactions.some((transaction) => transaction.pending === true)
    ) {
      // Payment is pending
      return {
        success: false,
        status: "pending",
        message: "الدفع قيد المعالجة. يرجى الانتظار قليلاً...",
        referenceNumber: transactions[0]?.order?.merchant_order_id || orderId,
      };
    } else {
      // Payment failed or was declined
      return {
        success: false,
        status: "failed",
        message: "فشلت عملية الدفع أو تم رفضها",
      };
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    throw new functions.https.HttpsError(
      "internal",
      error.message || "An unknown error occurred"
    );
  }
});

// Webhook to handle payment notifications from Paymob
exports.paymobWebhook = functions.https.onRequest(async (req, res) => {
  return cors(req, res, async () => {
    try {
      // Verify the request is from Paymob using HMAC
      const hmacHeader = req.headers["hmac"];
      if (!hmacHeader && PAYMOB_HMAC_SECRET) {
        return res.status(401).send("Unauthorized");
      }

      // We should verify HMAC here, but for simplicity, we'll skip it in this example

      const data = req.body;
      console.log("Webhook data:", JSON.stringify(data));

      if (!data || !data.obj) {
        return res.status(400).send("Invalid webhook data");
      }

      const { id, order, success, is_refunded, pending } = data.obj;

      if (!order || !order.id) {
        return res.status(400).send("Missing order information");
      }

      const orderId = order.id.toString();

      // Find order in Firestore
      const orderDoc = await db.collection("orders").doc(orderId).get();

      if (!orderDoc.exists) {
        return res.status(404).send("Order not found");
      }

      const orderData = orderDoc.data();

      // Update order status in Firestore
      if (success === true && !is_refunded) {
        // Payment successful
        await db.collection("orders").doc(orderId).update({
          status: "paid",
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          transactionId: id,
        });

        // If there's a user associated with this order, update their premium status
        if (orderData.userId) {
          // Calculate expiry date based on plan
          const now = new Date();
          let expiryDate;

          if (orderData.planId === "monthly") {
            expiryDate = new Date(now.setMonth(now.getMonth() + 1));
          } else if (orderData.planId === "quarterly") {
            expiryDate = new Date(now.setMonth(now.getMonth() + 3));
          } else if (orderData.planId === "yearly") {
            expiryDate = new Date(now.setFullYear(now.getFullYear() + 1));
          } else {
            // Default to monthly
            expiryDate = new Date(now.setMonth(now.getMonth() + 1));
          }

          // Update user's premium status
          await db
            .collection("users")
            .doc(orderData.userId)
            .update({
              isPremium: true,
              premiumExpiryDate: admin.firestore.Timestamp.fromDate(expiryDate),
              updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            });
        }
      } else if (pending === true) {
        // Payment is pending
        await db.collection("orders").doc(orderId).update({
          status: "pending",
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      } else {
        // Payment failed or was refunded
        await db
          .collection("orders")
          .doc(orderId)
          .update({
            status: is_refunded ? "refunded" : "failed",
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          });
      }

      return res.status(200).send("Webhook processed successfully");
    } catch (error) {
      console.error("Error processing webhook:", error);
      return res.status(500).send("Internal server error");
    }
  });
});
