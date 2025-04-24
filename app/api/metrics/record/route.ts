import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { site_id, event_type, payload } = body;

    // Validate required fields
    if (!site_id || !event_type) {
      return NextResponse.json(
        { error: "Missing required fields: site_id and event_type are required" },
        { status: 400 }
      );
    }

    // Validate that site_id exists in the sites table
    const { data: siteExists, error: siteCheckError } = await supabase
      .from("sites")
      .select("id")
      .eq("id", site_id)
      .maybeSingle();

    if (siteCheckError) {
      return NextResponse.json(
        { error: `Error validating site: ${siteCheckError.message}` },
        { status: 500 }
      );
    }

    if (!siteExists) {
      return NextResponse.json(
        { error: "Invalid site_id: site does not exist" },
        { status: 404 }
      );
    }

    // Insert event into sync_events table
    const { data: eventData, error: eventError } = await supabase
      .from("sync_events")
      .insert([
        {
          site_id,
          event_type,
          payload: payload || null
        }
      ])
      .select()
      .single();

    if (eventError) {
      return NextResponse.json(
        { error: `Failed to record event: ${eventError.message}` },
        { status: 500 }
      );
    }

    // Update last_synced_at in sites table
    const { error: updateSiteError } = await supabase
      .from("sites")
      .update({ last_synced_at: new Date().toISOString() })
      .eq("id", site_id);

    if (updateSiteError) {
      console.error("Failed to update site last_synced_at:", updateSiteError);
      // Continue execution even if this fails
    }

    return NextResponse.json({
      message: "Event recorded",
      event: eventData
    });
  } catch (error: any) {
    console.error("Error in metrics recording:", error);
    return NextResponse.json(
      { error: `Internal server error: ${error.message}` },
      { status: 500 }
    );
  }
}