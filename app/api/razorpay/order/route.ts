import { NextResponse } from "next/server";
import { periodLabels } from "@/lib/paymentDetails";
import { getAmountPaise, getRazorpayClient, isRazorpayConfigured } from "@/lib/razorpay-server";

export async function POST(request: Request) {
  if (!isRazorpayConfigured()) {
    return NextResponse.json(
      {
        error:
          "Razorpay is not configured. Add RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, and NEXT_PUBLIC_RAZORPAY_KEY_ID to your environment.",
      },
      { status: 503 },
    );
  }

  let body: { period?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const period = body.period;
  if (!period || typeof period !== "string") {
    return NextResponse.json({ error: "Plan period is required." }, { status: 400 });
  }

  const amountPaise = getAmountPaise(period);
  if (!amountPaise) {
    return NextResponse.json({ error: "Invalid plan period." }, { status: 400 });
  }

  const razorpay = getRazorpayClient();
  if (!razorpay) {
    return NextResponse.json({ error: "Razorpay client unavailable." }, { status: 503 });
  }

  const periodLabel = periodLabels[period] ?? period;
  const receipt = `atc_${period}_${Date.now()}`.slice(0, 40);

  try {
    const order = await razorpay.orders.create({
      amount: amountPaise,
      currency: "INR",
      receipt,
      notes: {
        product: "ATC Bot License",
        period,
        period_label: periodLabel,
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      periodLabel,
    });
  } catch (err) {
    console.error("Razorpay order creation failed:", err);
    return NextResponse.json(
      { error: "Could not create payment order. Please try again." },
      { status: 500 },
    );
  }
}
