import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
export async function GET() {
  const { data, error } = await supabase.from("donation_items").select("*").eq("is_active", true).order("id");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}
