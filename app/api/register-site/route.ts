import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  const { domain } = await req.json();

  if (!domain) {
    return NextResponse.json({ error: "Missing domain" }, { status: 400 });
  }

  const { data: existingSite, error: fetchError } = await supabase
    .from("sites")
    .select("id")
    .eq("domain", domain)
    .single();

  if (existingSite) {
    return NextResponse.json({ site_id: existingSite.id });
  }

  const { data: newSite, error: insertError } = await supabase
    .from("sites")
    .insert({ domain })
    .select()
    .single();

  if (insertError || !newSite) {
    return NextResponse.json({ error: insertError?.message }, { status: 500 });
  }

  return NextResponse.json({ site_id: newSite.id });
}
