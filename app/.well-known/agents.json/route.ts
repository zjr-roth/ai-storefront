import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(req: Request) {
  const host = new URL(req.url).hostname;

  // 🔍 Step 1: Look up the matching site by domain
  const { data: site, error } = await supabase
    .from("sites")
    .select("id")
    .eq("domain", host)
    .single();

  if (error || !site) {
    return NextResponse.json(
      { error: "Site not found for this domain." },
      { status: 404 }
    );
  }
  const manifestHost =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : `https://${host}`;

return NextResponse.json({
  manifest_url: `${manifestHost}/api/manifest/${site.id}`,
});

}
