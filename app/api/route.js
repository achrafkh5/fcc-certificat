import { NextResponse } from "next/server";
export const config = {
  api: {
    externalResolver: true,
  },
};
export async function GET() {
  const time = new Date();
  return NextResponse.json({
    unix: time.getTime(),
    utc: time.toUTCString(),
  },{
      status: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
    })
  ;
}
