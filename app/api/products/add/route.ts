import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  const body = await req.json();
  const { site_id, title, price, image_url, buy_url, description } = body;

  if (!site_id || !title || !price) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const { data: existing, error: fetchError } = await supabase
    .from("products")
    .select("id")
    .eq("site_id", site_id)
    .eq("buy_url", buy_url)
    .single();

  if (existing) {
    return NextResponse.json({ message: "Product already exists", product_id: existing.id });
  }

  const { data, error } = await supabase
    .from("products")
    .insert([{ site_id, title, price: parseFloat(price), image_url, buy_url, description }])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Product added", product: data });
}
