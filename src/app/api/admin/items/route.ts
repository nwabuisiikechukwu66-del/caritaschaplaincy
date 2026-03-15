import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { cookies } from "next/headers";

async function validateAdmin(): Promise<boolean> {
  const cookieStore = cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token) return false;
  const { data } = await supabase.from("admin_sessions").select("*").eq("token", token).gt("expires_at", new Date().toISOString()).single();
  return !!data;
}

export async function GET(req: NextRequest) {
  if (!(await validateAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const table = searchParams.get("table");
  const allowedTables = ["announcements", "events", "mass_intentions", "petitions", "donations"];
  if (!table || !allowedTables.includes(table)) return NextResponse.json({ error: "Invalid table" }, { status: 400 });
  const { data, error } = await supabase.from(table).select("*").order("created_at", { ascending: false }).limit(100);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}
