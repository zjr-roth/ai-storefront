import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

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
  const { siteId } = params;

  // Validate siteId
  if (!siteId) {
    return NextResponse.json({ error: "Missing site ID" }, { status: 400 });
  }

  // Validate site exists
  const { data: site, error: siteError } = await supabase
    .from("sites")
    .select("id")
    .eq("id", siteId)
    .single();

  if (siteError || !site) {
    return NextResponse.json(
      { error: "Invalid site_id: Site not found" },
      { status: 404 }
    );
  }

  // Get timestamp for 24 hours ago
  const twentyFourHoursAgo = new Date();
  twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);
  const timeThreshold = twentyFourHoursAgo.toISOString();

  try {
    // 1. Check if manifest is valid (manifest_fetched event in last 24h)
    const { data: manifestEvents, error: manifestError } = await supabase
      .from("sync_events")
      .select("created_at")
      .eq("site_id", siteId)
      .eq("event_type", "manifest_fetched")
      .gte("created_at", timeThreshold)
      .order("created_at", { ascending: false })
      .limit(1);

    if (manifestError) {
      console.error("Error checking manifest status:", manifestError);
      return NextResponse.json(
        { error: "Failed to check manifest status" },
        { status: 500 }
      );
    }

    // 2. Count products
    const { count: productsCount, error: countError } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("site_id", siteId);

    if (countError) {
      console.error("Error counting products:", countError);
      return NextResponse.json(
        { error: "Failed to count products" },
        { status: 500 }
      );
    }

    // 3. Check for missing schema event in last 24h
    const { data: schemaEvents, error: schemaError } = await supabase
      .from("sync_events")
      .select("created_at")
      .eq("site_id", siteId)
      .eq("event_type", "schema_missing")
      .gte("created_at", timeThreshold)
      .order("created_at", { ascending: false })
      .limit(1);

    if (schemaError) {
      console.error("Error checking schema status:", schemaError);
      return NextResponse.json(
        { error: "Failed to check schema status" },
        { status: 500 }
      );
    }

    // 4. Get last manifest fetch time
    const { data: lastFetch, error: lastFetchError } = await supabase
      .from("sync_events")
      .select("created_at")
      .eq("site_id", siteId)
      .eq("event_type", "manifest_fetched")
      .order("created_at", { ascending: false })
      .limit(1);

    if (lastFetchError) {
      console.error("Error getting last fetch time:", lastFetchError);
      return NextResponse.json(
        { error: "Failed to get last fetch time" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      manifest_valid: manifestEvents && manifestEvents.length > 0,
      products_count: productsCount || 0,
      missing_schema: schemaEvents && schemaEvents.length > 0,
      last_manifest_fetch: lastFetch && lastFetch.length > 0 ? lastFetch[0].created_at : null
    });

  } catch (error: any) {
    console.error("Error in site status API:", error);
    return NextResponse.json(
      { error: `Internal server error: ${error.message}` },
      { status: 500 }
    );
  }
}