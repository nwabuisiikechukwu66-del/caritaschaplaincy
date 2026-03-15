import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
export async function GET() {
  const { data, error } = await supabase.from("events").select("*").eq("is_approved", true).gte("event_date", new Date().toISOString().split("T")[0]).order("event_date");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title, description, event_date, event_time, location, submitted_by } = body;
  if (!title || !event_date) return NextResponse.json({ error: "Title and date required" }, { status: 400 });
  const { data, error } = await supabase.from("events").insert({ title, description, event_date, event_time, location, submitted_by, is_approved: false }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
