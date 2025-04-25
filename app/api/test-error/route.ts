import { NextResponse } from "next/server";

export async function GET() {
  // Simulate a server error
  return NextResponse.json(
    { error: "This is a test error response" },
    { status: 500 }
  );
}