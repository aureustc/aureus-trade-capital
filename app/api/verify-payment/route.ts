import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { customAlphabet } from "nanoid";
import { amountByPeriod } from "@/lib/paymentDetails";
import { computeExpiry, extendExpiry } from "@/lib/licenses";
import type { Period } from "@/lib/paymentTypes";
import { getSupabase } from "@/lib/supabase/db";

const nanoidSegment = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ", 6);

function generateLicenseKey(): string {
  return `ATC-${nanoidSegment()}-${nanoidSegment()}-${nanoidSegment()}-${nanoidSegment()}`;
}

export async function POST(req: NextRequest) {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Razorpay is not configured." }, { status: 503 });
  }

  let body: {
    razorpay_order_id?: string;
    razorpay_payment_id?: string;
    razorpay_signature?: string;
    plan?: string;
    period?: string;
    amount?: number;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    plan,
    period,
    amount,
  } = body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return NextResponse.json({ error: "Missing payment verification fields." }, { status: 400 });
  }

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return NextResponse.json(
      { verified: false, error: "Payment verification failed." },
      { status: 400 },
    );
  }

  const { userId } = await auth();

  // Guest checkout: signature verified; license created after sign-up via pending payment
  if (!userId) {
    return NextResponse.json({
      verified: true,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
    });
  }

  const db = getSupabase();
  if (!db) {
    return NextResponse.json({ error: "Database not configured." }, { status: 503 });
  }

  const periodKey = (period ?? "three") as Period;
  const amountInr = amount ?? amountByPeriod[periodKey] ?? 0;
  const amountPaise = amountInr * 100;
  const now = new Date();

  const { data: existing } = await db
    .from("licenses")
    .select("*")
    .eq("user_id", userId)
    .order("purchased_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  let licenseKey: string;
  let expiresAt: Date | null;

  if (existing) {
    licenseKey = existing.license_key;
    expiresAt = extendExpiry(
      existing.expires_at ? new Date(existing.expires_at) : null,
      periodKey,
      now,
    );

    const { error } = await db
      .from("licenses")
      .update({
        plan: plan ?? "atc_bot",
        period: periodKey,
        status: "active",
        razorpay_order_id,
        razorpay_payment_id,
        amount_paid: amountPaise,
        purchased_at: now.toISOString(),
        expires_at: expiresAt?.toISOString() ?? null,
      })
      .eq("id", existing.id);

    if (error) {
      console.error("License update failed:", error);
      return NextResponse.json({ error: "Could not save license." }, { status: 500 });
    }
  } else {
    licenseKey = generateLicenseKey();
    expiresAt = computeExpiry(periodKey, now);

    const { error } = await db.from("licenses").insert({
      user_id: userId,
      plan: plan ?? "atc_bot",
      period: periodKey,
      license_key: licenseKey,
      status: "active",
      razorpay_order_id,
      razorpay_payment_id,
      amount_paid: amountPaise,
      purchased_at: now.toISOString(),
      expires_at: expiresAt?.toISOString() ?? null,
    });

    if (error) {
      console.error("License creation failed:", error);
      return NextResponse.json({ error: "Could not save license." }, { status: 500 });
    }
  }

  return NextResponse.json({
    verified: true,
    paymentId: razorpay_payment_id,
    orderId: razorpay_order_id,
    licenseKey,
  });
}
