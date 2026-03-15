import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { donor_name, email, item_id, item_name, amount, is_charity, message } = body;

    if (!donor_name?.trim() || !amount) {
      return NextResponse.json({ error: "Name and Amount are required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("donations")
      .insert({
        donor_name: donor_name.trim(),
        email: email?.trim() || null,
        item_id: item_id || null,
        item_name: item_name || null,
        amount: Number(amount),
        is_charity: is_charity || false,
        message: message?.trim() || null,
        payment_status: "pending"
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
