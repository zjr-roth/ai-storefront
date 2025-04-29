import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    product: {
      title: "Stainless Steel French Press",
      body_html: "Double-walled stainless steel French press that keeps coffee hot for hours.",
      handle: "stainless-steel-french-press",
      variants: [
        {
          price: "44.99"
        }
      ],
      images: [
        {
          src: "https://picsum.photos/400/400?random=13"
        }
      ]
    }
  });
}