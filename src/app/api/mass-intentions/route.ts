import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date") || new Date().toISOString().split("T")[0];
  const type = searchParams.get("type");

  let query = supabase
    .from("mass_intentions")
    .select("*")
    .eq("is_approved", true)
    .eq("intention_date", date)
    .order("created_at", { ascending: true });

  if (type) query = query.eq("type", type);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, isAnonymous, intention, date, type, amount } = body;

  if (!intention?.trim()) return NextResponse.json({ error: "Intention is required" }, { status: 400 });

  const { data, error } = await supabase
    .from("mass_intentions")
    .insert({
      name: isAnonymous ? "Anonymous" : (name || "Anonymous"),
      is_anonymous: isAnonymous || false,
      intention: intention.trim(),
      intention_date: date || new Date().toISOString().split("T")[0],
      type: type || "intention",
      amount: amount || (type === "thanksgiving" ? 2500 : 100),
      payment_status: "pending",
      is_approved: false,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
