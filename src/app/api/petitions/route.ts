import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabase
    .from("petitions")
    .select("*")
    .eq("is_approved", true)
    .order("created_at", { ascending: false })
    .limit(20);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, isAnonymous, petition } = body;
  if (!petition?.trim()) return NextResponse.json({ error: "Petition is required" }, { status: 400 });
  const { data, error } = await supabase
    .from("petitions")
    .insert({ name: isAnonymous ? null : name, is_anonymous: isAnonymous || false, petition: petition.trim(), is_approved: false })
    .select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
