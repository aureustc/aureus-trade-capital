import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/db";
import type { LicenseRecord } from "@/lib/licenses";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getSupabase();
  if (!db) {
    return NextResponse.json({ error: "Database not configured." }, { status: 503 });
  }

  const [{ data: license }, { data: tickets }] = await Promise.all([
    db
      .from("licenses")
      .select("*")
      .eq("user_id", userId)
      .order("purchased_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    db
      .from("tickets")
      .select("id, subject, category, status, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false }),
  ]);

  return NextResponse.json({
    license: license as LicenseRecord | null,
    tickets: tickets ?? [],
  });
}
