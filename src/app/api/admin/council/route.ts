import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { cookies } from "next/headers";

async function validateAdmin(): Promise<boolean> {
    const cookieStore = cookies();
    const token = cookieStore.get("admin_token")?.value;
    if (!token) {
        console.log("[Council API] No admin_token cookie found");
        return false;
    }
    const { data, error } = await supabase
        .from("admin_sessions")
        .select("*")
        .eq("token", token)
        .gt("expires_at", new Date().toISOString())
        .single();

    if (error || !data) {
        console.log("[Council API] Session validation failed for token:", token.slice(0, 8), error?.message);
        return false;
    }
    return true;
}

export async function GET(req: NextRequest) {
    if (!(await validateAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type"); // executives, sacristans, catechists, authorities
    const id = searchParams.get("id");

    if (type === "executives") {
        const { data } = await supabase.from("council_executives").select("*").order("academic_year", { ascending: false });
        return NextResponse.json(data);
    } else if (type === "sacristans") {
        const { data } = await supabase.from("sacristans").select("*").order("id");
        return NextResponse.json(data);
    } else if (type === "catechists") {
        const { data } = await supabase.from("catechists").select("*").order("id");
        return NextResponse.json(data);
    } else if (type === "authorities") {
        const { data } = await supabase.from("university_authorities").select("*").order("order_rank");
        return NextResponse.json(data);
    } else if (type === "societies") {
        const { data } = await supabase.from("societies").select("*").order("name");
        return NextResponse.json(data);
    } else if (type === "doctrines") {
        const { data } = await supabase.from("doctrines").select("*").order("question");
        return NextResponse.json(data);
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
}

export async function POST(req: NextRequest) {
    if (!(await validateAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { type, ...item } = await req.json();
    const table = type === "executives" ? "council_executives" :
        type === "sacristans" ? "sacristans" :
            type === "catechists" ? "catechists" :
                type === "authorities" ? "university_authorities" :
                    type === "societies" ? "societies" :
                        type === "doctrines" ? "doctrines" : null;

    if (!table) return NextResponse.json({ error: "Invalid type" }, { status: 400 });

    const { data, error } = await supabase.from(table).insert([item]).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}

export async function PATCH(req: NextRequest) {
    if (!(await validateAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { type, id, ...updates } = await req.json();
    const table = type === "executives" ? "council_executives" :
        type === "sacristans" ? "sacristans" :
            type === "catechists" ? "catechists" :
                type === "authorities" ? "university_authorities" :
                    type === "societies" ? "societies" :
                        type === "doctrines" ? "doctrines" : null;

    if (!table) return NextResponse.json({ error: "Invalid type" }, { status: 400 });

    const { data, error } = await supabase.from(table).update(updates).eq("id", id).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}

export async function DELETE(req: NextRequest) {
    if (!(await validateAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const id = searchParams.get("id");
    const table = type === "executives" ? "council_executives" :
        type === "sacristans" ? "sacristans" :
            type === "catechists" ? "catechists" :
                type === "authorities" ? "university_authorities" :
                    type === "societies" ? "societies" :
                        type === "doctrines" ? "doctrines" : null;

    if (!table || !id) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
}
