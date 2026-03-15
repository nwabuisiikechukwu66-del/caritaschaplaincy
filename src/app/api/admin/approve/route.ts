import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { cookies } from "next/headers";

async function validateAdmin(): Promise<boolean> {
  const cookieStore = cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token) return false;
  const { data } = await supabase
    .from("admin_sessions")
    .select("*")
    .eq("token", token)
    .gt("expires_at", new Date().toISOString())
    .single();
  return !!data;
}

export async function PATCH(req: NextRequest) {
  if (!(await validateAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { table, id, action, ...updates } = await req.json();
  const allowedTables = ["announcements", "events", "mass_intentions", "petitions", "donations"];
  if (!allowedTables.includes(table)) return NextResponse.json({ error: "Invalid table" }, { status: 400 });

  const updateData: any = {};
  if (action === "approve") updateData.is_approved = true;
  else if (action === "reject") updateData.is_approved = false;
  else Object.assign(updateData, updates);

  const { data, error } = await supabase.from(table).update(updateData).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
