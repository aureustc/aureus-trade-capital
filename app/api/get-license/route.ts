import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { LicenseRecord } from "@/lib/licenses";
import { getSupabase } from "@/lib/supabase/db";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getSupabase();
  if (!db) {
    return NextResponse.json({ error: "Database not configured." }, { status: 503 });
  }

  const { data: license, error } = await db
    .from("licenses")
    .select("*")
    .eq("user_id", userId)
    .order("purchased_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("License fetch failed:", error);
    return NextResponse.json({ license: null });
  }

  return NextResponse.json({ license: (license as LicenseRecord | null) ?? null });
}
