import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(
    req: Request,
    context: { params: { siteId: string } }
  ) {
    const siteId = context.params.siteId; // explicitly unwrap it

    const { data: products, error } = await supabase
      .from("products")
      .select("*")
      .eq("site_id", siteId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      store_name: "Test Store",
      products: products.map((p) => ({
        title: p.title,
        price: parseFloat(p.price),
        description: p.description,
        image: p.image_url,
        buy_url: p.buy_url,
      })),
    });
  }

