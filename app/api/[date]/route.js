import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { date } = params;

  let time;

  // if number
  if (!isNaN(date)) {
    time = new Date(Number(date));
  }
  // if valid date string
  else if (!isNaN(Date.parse(date))) {
    time = new Date(date);
  }
  // invalid
  else {
    return NextResponse.json({ error: "Invalid Date" });
  }

  return NextResponse.json({
    unix: time.getTime(),
    utc: time.toUTCString(),
  });
}
