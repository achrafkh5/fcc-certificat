import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const dateParam = params.date?.[0]; // undefined if not provided
  let time;

  if (!dateParam) {
    // no param → current date
    time = new Date();
  } else if (!isNaN(dateParam) && dateParam.trim() !== "") {
    // numeric timestamp
    time = new Date(Number(dateParam));
  } else if (!isNaN(Date.parse(dateParam))) {
    // valid date string
    time = new Date(dateParam);
  } else {
    return NextResponse.json({ error: "Invalid Date" });
  }

  return NextResponse.json({
    unix: time.getTime(),
    utc: time.toUTCString(),
  });
}
