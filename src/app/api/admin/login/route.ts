import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();
  const validUser = process.env.ADMIN_USERNAME || "caritasadminchap";
  const validPass = process.env.ADMIN_PASSWORD || "carit@$do-not-tell_2004";

  if (username !== validUser || password !== validPass) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000); // 8 hours

  await supabase.from("admin_sessions").insert({ token, expires_at: expiresAt.toISOString() });

  const res = NextResponse.json({ success: true });
  res.cookies.set("admin_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.delete("admin_token");
  return res;
}
