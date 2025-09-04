import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  return NextResponse.json({ test: true, id: params.id });
}