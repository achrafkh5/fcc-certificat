import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { date } = params;
  let parsedDate;

  if (/^\d+$/.test(date)) {
    parsedDate = new Date(parseInt(date));
  } else {
    parsedDate = new Date(date);
  }

  if (parsedDate.toString() === "Invalid Date") {
    return NextResponse.json({ error: "Invalid Date" });
  }

  return NextResponse.json({
    unix: parsedDate.getTime(),
    utc: parsedDate.toUTCString(),
  });
}
