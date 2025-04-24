import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Helper function to record metrics events
async function recordMetricsEvent(site_id: string, event_type: string, payload: any) {
  try {
    // TODO: ADD VERCEL_URL to env variables / NEXT_PUBLIC_BASE_URL
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    await fetch(`${baseUrl}/api/metrics/record`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Add internal API key or auth headers if needed
      },
      body: JSON.stringify({
        site_id,
        event_type,
        payload
      })
    });
  } catch (error) {
    // Log error but don't fail the main request
    console.error("Failed to record metrics:", error);
  }
}

export async function POST(req: Request) {
  const body = await req.json();
  const { site_id, title, price, image_url, buy_url, description } = body;

  // Validate required fields
  if (!site_id || !title || !price) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Check if product already exists with the same site_id and buy_url
  const { data: existing, error: fetchError } = await supabase
    .from("products")
    .select("id, title, price")
    .eq("site_id", site_id)
    .eq("buy_url", buy_url)
    .single();

  if (fetchError && fetchError.code !== "PGRST116") {
    // PGRST116 is "no rows returned" - any other error is a problem
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  const now = new Date().toISOString();

  // If product exists
  if (existing) {
    const numericPrice = parseFloat(price);

    // Check if title or price has changed
    if (existing.title !== title || existing.price !== numericPrice) {
      console.log(`Product data changed for ${existing.id}:`, {
        oldTitle: existing.title,
        newTitle: title,
        oldPrice: existing.price,
        newPrice: numericPrice
      });

      // Update the existing product
      const { data: updated, error: updateError } = await supabase
        .from("products")
        .update({
          title,
          price: numericPrice,
          ...(image_url && { image_url }),
          ...(description && { description }),
          last_synced_at: now // Set last_synced_at to current time
        })
        .eq("id", existing.id)
        .select()
        .single();

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }

      // Record metrics for product update
      await recordMetricsEvent(site_id, "product_updated", updated);

      // Update the site's last_synced_at timestamp
      await supabase
        .from("sites")
        .update({ last_synced_at: now })
        .eq("id", site_id);

      return NextResponse.json({
        message: "Product updated",
        product: updated,
        changes: {
          title: existing.title !== title,
          price: existing.price !== numericPrice
        }
      });
    }

    // Update last_synced_at even if product hasn't changed
    const { error: syncUpdateError } = await supabase
      .from("products")
      .update({ last_synced_at: now })
      .eq("id", existing.id);

    if (syncUpdateError) {
      console.error("Error updating last_synced_at:", syncUpdateError);
    }

    // Update site's last_synced_at timestamp
    await supabase
      .from("sites")
      .update({ last_synced_at: now })
      .eq("id", site_id);

    // Record metrics for product sync (no changes)
    await recordMetricsEvent(site_id, "product_synced", {
      product_id: existing.id,
      title,
      price: parseFloat(price),
      changed: false
    });

    // Product exists and hasn't changed
    return NextResponse.json({
      message: "Product already exists",
      product_id: existing.id
    });
  }

  // Insert new product
  const { data, error } = await supabase
    .from("products")
    .insert([{
      site_id,
      title,
      price: parseFloat(price),
      image_url,
      buy_url,
      description,
      last_synced_at: now // Set last_synced_at for new product
    }])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Update site's last_synced_at timestamp
  await supabase
    .from("sites")
    .update({ last_synced_at: now })
    .eq("id", site_id);

  // Record metrics for new product
  await recordMetricsEvent(site_id, "product_added", data);

  return NextResponse.json({ message: "Product added", product: data });
}