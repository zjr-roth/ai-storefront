import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    product: {
      title: "Portable Bluetooth Speaker",
      body_html: "Waterproof bluetooth speaker with 12-hour battery life and amazing sound quality.",
      handle: "portable-bluetooth-speaker",
      variants: [
        {
          price: "59.99"
        }
      ],
      images: [
        {
          src: "https://picsum.photos/400/400?random=12"
        }
      ]
    }
  });
}