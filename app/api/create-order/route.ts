import { NextRequest, NextResponse } from "next/server";
import { amountByPeriod, periodLabels } from "@/lib/paymentDetails";
import { getRazorpayClient, isRazorpayConfigured } from "@/lib/razorpay-server";

export async function POST(req: NextRequest) {
  if (!isRazorpayConfigured()) {
    return NextResponse.json(
      {
        error:
          "Razorpay is not configured. Add RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, and NEXT_PUBLIC_RAZORPAY_KEY_ID to your environment.",
      },
      { status: 503 },
    );
  }

  let body: { amount?: number; plan?: string; period?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { amount, plan, period } = body;
  if (!amount || typeof amount !== "number" || amount <= 0) {
    return NextResponse.json({ error: "Valid amount is required." }, { status: 400 });
  }
  if (!period || typeof period !== "string") {
    return NextResponse.json({ error: "Plan period is required." }, { status: 400 });
  }

  const expectedAmount = amountByPeriod[period];
  if (!expectedAmount || expectedAmount !== amount) {
    return NextResponse.json({ error: "Amount does not match selected plan." }, { status: 400 });
  }

  const razorpay = getRazorpayClient();
  if (!razorpay) {
    return NextResponse.json({ error: "Razorpay client unavailable." }, { status: 503 });
  }

  const periodLabel = periodLabels[period] ?? period;
  const receipt = `atc_${period}_${Date.now()}`.slice(0, 40);

  try {
    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt,
      notes: {
        plan: plan ?? "ATC Bot License",
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
