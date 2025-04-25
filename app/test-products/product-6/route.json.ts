import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    product: {
      title: "Indoor Plant Set",
      body_html: "Set of 3 easy-care indoor plants in decorative pots. Perfect for home or office.",
      handle: "indoor-plant-set",
      variants: [
        {
          price: "49.99"
        }
      ],
      images: [
        {
          src: "https://picsum.photos/400/400?random=15"
        }
      ]
    }
  });
}