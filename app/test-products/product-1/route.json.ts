import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    product: {
      title: "Premium Backpack",
      body_html: "Water-resistant backpack with laptop compartment and multiple pockets.",
      handle: "premium-backpack",
      variants: [
        {
          price: "79.99"
        }
      ],
      images: [
        {
          src: "https://picsum.photos/400/400?random=10"
        }
      ]
    }
  });
}