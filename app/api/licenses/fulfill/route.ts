import crypto from "crypto";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { amountByPeriod } from "@/lib/paymentDetails";
import {
  computeExpiry,
  extendExpiry,
  generateLicenseKey,
} from "@/lib/licenses";
import type { Period } from "@/lib/paymentTypes";
import { getSupabase } from "@/lib/supabase/db";

export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Payment system not configured." }, { status: 503 });
  }

  let body: {
    razorpay_order_id?: string;
    razorpay_payment_id?: string;
    razorpay_signature?: string;
    period?: Period;
    renew?: boolean;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, period, renew } = body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !period) {
    return NextResponse.json({ error: "Missing payment fields." }, { status: 400 });
  }

  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expected !== razorpay_signature) {
    return NextResponse.json({ error: "Payment verification failed." }, { status: 400 });
  }

  const amountInr = amountByPeriod[period];
  if (!amountInr) {
    return NextResponse.json({ error: "Invalid plan period." }, { status: 400 });
  }

  const db = getSupabase();
  if (!db) {
    return NextResponse.json({ error: "Database not configured." }, { status: 503 });
  }

  const { data: existing } = await db
    .from("licenses")
    .select("*")
    .eq("user_id", userId)
    .order("purchased_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const amountPaise = amountInr * 100;
  const now = new Date();

  if (existing && renew) {
    const newExpiry = extendExpiry(
      existing.expires_at ? new Date(existing.expires_at) : null,
      period,
      now,
    );

    const { data: updated, error } = await db
      .from("licenses")
      .update({
        period,
        status: "active",
        expires_at: newExpiry?.toISOString() ?? null,
        razorpay_order_id,
        razorpay_payment_id,
        amount_paid: amountPaise,
        purchased_at: now.toISOString(),
      })
      .eq("id", existing.id)
      .select()
      .single();

    if (error) {
      console.error("License renewal failed:", error);
      return NextResponse.json({ error: "Could not renew license." }, { status: 500 });
    }

    return NextResponse.json({ license: updated, renewed: true });
  }

  if (existing && !renew) {
    return NextResponse.json({ license: existing, renewed: false });
  }

  const licenseKey = generateLicenseKey();
  const expiresAt = computeExpiry(period, now);

  const { data: created, error } = await db
    .from("licenses")
    .insert({
      user_id: userId,
      plan: "atc_bot",
      period,
      license_key: licenseKey,
      status: "active",
      expires_at: expiresAt?.toISOString() ?? null,
      razorpay_order_id,
      razorpay_payment_id,
      amount_paid: amountPaise,
    })
    .select()
    .single();

  if (error) {
    console.error("License creation failed:", error);
    return NextResponse.json({ error: "Could not create license." }, { status: 500 });
  }

  return NextResponse.json({ license: created, renewed: false });
}
