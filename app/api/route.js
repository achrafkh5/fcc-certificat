import { NextResponse } from "next/server";

export async function GET() {
  const time = new Date();
  return NextResponse.json({
    unix: time.getTime(),
    utc: time.toUTCString(),
  });
}
