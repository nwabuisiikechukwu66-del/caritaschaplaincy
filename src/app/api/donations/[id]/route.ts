import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const body = await req.json();
        const { payment_status, payment_reference } = body;

        const { data, error } = await supabase
            .from("donations")
            .update({
                payment_status,
                payment_reference
            })
            .eq("id", params.id)
            .select()
            .single();

        if (error) return NextResponse.json({ error: error.message }, { status: 500 });

        // Also update the raised_amount in donation_items if this applies to a specific item
        if (payment_status === "paid" && data.item_id && data.item_id !== "general") {
            // Best-effort update, don't fail if it doesn't work perfectly
            await supabase.rpc("increment_donation_amount", {
                item_id_param: data.item_id,
                amount_param: data.amount
            });
            // Note: Supabase doesn't have a default increment RPC, so we might need to fetch & update
            // But for simplicity, we'll fetch & update here
            const { data: item } = await supabase.from("donation_items").select("raised_amount").eq("id", data.item_id).single();
            if (item) {
                await supabase.from("donation_items").update({ raised_amount: item.raised_amount + data.amount }).eq("id", data.item_id);
            }
        }

        return NextResponse.json(data);
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
