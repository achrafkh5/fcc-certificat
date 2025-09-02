// app/api/[...date]/route.js
import { NextResponse } from "next/server";

export const config = {
  api: {
    externalResolver: true,
  },
};

export async function GET(request, { params }) {
  const dateParam = params?.date?.[0]; // undefined if not provided
  let time;

  if (!dateParam) {
    // No param → current date
    time = new Date();
  } else if (/^\d+$/.test(dateParam)) {
    // Numeric timestamp
    time = new Date(Number(dateParam));
  } else if (!isNaN(Date.parse(dateParam))) {
    // Valid date string
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
