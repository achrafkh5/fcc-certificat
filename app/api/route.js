import { NextResponse } from "next/server";

export async function GET() {
  const time = new Date();
  const utc = time.toUTCString();
  const unix = time.getTime();
  return NextResponse.json({ unix, utc });
}
