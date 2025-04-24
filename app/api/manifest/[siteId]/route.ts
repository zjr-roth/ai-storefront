import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Define the proper type for the params
interface RouteParams {
  params: {
    siteId: string;
  };
}

export async function GET(
  req: Request,
  { params }: RouteParams
) {
  // Correctly use the properly typed params
  const { siteId } = params;

  // Validate siteId
  if (!siteId) {
    return NextResponse.json({ error: "Missing site ID" }, { status: 400 });
  }

  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .eq("site_id", siteId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    store_name: "Test Store",
    products: products ? products.map((p) => ({
      title: p.title,
      price: parseFloat(p.price),
      description: p.description,
      image_url: p.image_url,
      buy_url: p.buy_url,
    })) : [],
  });
}