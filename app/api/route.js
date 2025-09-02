import { NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function GET() {
  const time = new Date();
  const utc = time.toUTCString();
  const unix = time.getTime();
  return NextResponse.json({ unix, utc });
}
