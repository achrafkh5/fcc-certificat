import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const { date } = params;
    
    if(isNaN(date) && !isNaN(Date.parse(date))) {
        const time = new Date(date);
        return NextResponse.json({ unix:Math.floor(time.getTime()),utc:time.toUTCString() }, { status: 200 });
      } else if(!isNaN(date)) {
        const time = new Date(Number(date));
        return NextResponse.json({ unix:Math.floor(time.getTime()),utc:time.toUTCString() }, { status: 200 });
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