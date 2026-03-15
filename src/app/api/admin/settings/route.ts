import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { cookies } from "next/headers";

async function validateAdmin(): Promise<boolean> {
    const cookieStore = cookies();
    const token = cookieStore.get("admin_token")?.value;
    if (!token) {
        console.log("[Settings API] No admin_token cookie found");
        return false;
    }

    const { data, error } = await supabase
        .from("admin_sessions")
        .select("*")
        .eq("token", token)
        .gt("expires_at", new Date().toISOString())
        .single();

    if (error || !data) {
        console.log("[Settings API] Session validation failed for token:", token.slice(0, 8), error?.message);
        return false;
    }
    return true;
}

export async function GET(req: NextRequest) {
    if (!(await validateAdmin())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase.from("app_settings").select("*");
    if (error) {
        // If table doesn't exist, return default structure to avoid crashing
        if (error.code === "PGRST116" || error.message.includes("does not exist")) {
            return NextResponse.json([
                { key: "bank_details", value: { bank_name: "First Bank", account_number: "...", account_name: "..." } },
                { key: "chaplaincy_info", value: { name: "...", chaplain: "...", address: "..." } }
            ]);
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}

export async function PATCH(req: NextRequest) {
    if (!(await validateAdmin())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { key, value } = await req.json();
    if (!key || !value) return NextResponse.json({ error: "Key and value required" }, { status: 400 });

    const { data, error } = await supabase
        .from("app_settings")
        .upsert({ key, value, updated_at: new Date().toISOString() })
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}
