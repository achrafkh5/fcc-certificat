
import { NextResponse } from "next/server";

export const config = {
  api: {
    externalResolver: true,
  },
};

export async function GET(request, { params }) {
  const dateParam = params?.date; // undefined if not provided
  let time;

  if (/^\d+$/.test(dateParam)) {
    // numeric timestamp
    time = new Date(Number(dateParam));
  } else if (!isNaN(Date.parse(dateParam))) {
    // valid date string
    time = new Date(dateParam);
  } else {
    return NextResponse.json(
      { error: "Invalid Date" },
      {
        status: 400,
        headers: { "Access-Control-Allow-Origin": "*" },
      }
    );
  }

  return NextResponse.json(
    {
      unix: time.getTime(),
      utc: time.toUTCString(),
    },
    {
      status: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
    }
  );
}
