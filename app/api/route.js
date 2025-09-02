import { NextResponse } from "next/server";
export const config = {
  api: {
    externalResolver: true,
  },
};

res.setHeader("Access-Control-Allow-Origin", "*");
res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
res.setHeader("Access-Control-Allow-Headers", "Content-Type");
export async function GET() {
  const time = new Date();
  return NextResponse.json({
    unix: time.getTime(),
    utc: time.toUTCString(),
  });
}
