import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    product: {
      title: "Smart Watch",
      body_html: "Fitness tracker with heart rate monitor, sleep tracking, and smartphone notifications.",
      handle: "smart-watch",
      variants: [
        {
          price: "129.99"
        }
      ],
      images: [
        {
          src: "https://picsum.photos/400/400?random=11"
        }
      ]
    }
  });
}