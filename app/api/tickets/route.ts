import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/db";

export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getSupabase();
  if (!db) {
    return NextResponse.json({ error: "Database not configured." }, { status: 503 });
  }

  let body: { subject?: string; category?: string; message?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { subject, category, message } = body;
  if (!subject || !message || message.length < 20) {
    return NextResponse.json({ error: "Subject and message (min 20 chars) required." }, { status: 400 });
  }

  const { data, error } = await db
    .from("tickets")
    .insert({
      user_id: userId,
      subject,
      category: category ?? "General Inquiry",
      message,
    })
    .select()
    .single();

  if (error) {
    console.error("Ticket insert failed:", error);
    return NextResponse.json({ error: "Could not submit ticket." }, { status: 500 });
  }

  return NextResponse.json({ ticket: data });
}
