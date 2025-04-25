import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    product: {
      title: "Mechanical Keyboard",
      body_html: "Tactile mechanical keyboard with programmable RGB backlighting and customizable keys.",
      handle: "mechanical-keyboard",
      variants: [
        {
          price: "109.99"
        }
      ],
      images: [
        {
          src: "https://picsum.photos/400/400?random=14"
        }
      ]
    }
  });
}