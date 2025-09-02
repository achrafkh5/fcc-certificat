import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const { date } = params;   // ✅ no await here

    if (!date) {
      // no param → current time
      const time = new Date();
      const utc = time.toUTCString();
      const unix = time.getTime();
      return NextResponse.json({ unix, utc });
    } else if (isNaN(date) && !isNaN(Date.parse(date))) {
      // date string
      const time = new Date(date);
      const utc = time.toUTCString();
      const unix = time.getTime();
      return NextResponse.json({ unix, utc });
    } else if (!isNaN(date)) {
      // unix timestamp
      const time = new Date(Number(date));
      const utc = time.toUTCString();
      const unix = time.getTime();
      return NextResponse.json({ unix, utc });
    } else {
      // ❌ must match FCC exactly
      return NextResponse.json({ error: "Invalid Date" });
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
