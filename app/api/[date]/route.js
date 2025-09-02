import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const { date } = await params;

    if(!date) {
        const time = new Date();
        const utc = time.toUTCString();
        const unix = Math.floor(time.getTime());
        return NextResponse.json({ unix,utc }, { status: 200 });
      } else if(isNaN(date) && !isNaN(Date.parse(date))) {
        const time = new Date(date);
        const utc = time.toUTCString();
        const unix = Math.floor(time.getTime());
        return NextResponse.json({ unix,utc }, { status: 200 });
      } else if(!isNaN(date)) {
        const time = new Date(Number(date));
        console.log(date,time);
        const utc = time.toUTCString();
        const unix = Math.floor(time.getTime());
        return NextResponse.json({ unix,utc }, { status: 200 });
      }else{
        console.log(Date.parse(date));
        return NextResponse.json({ error:"Invalid date" }, { status: 404 });
      }
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}