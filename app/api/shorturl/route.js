
import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
export const config = {
  api: {
    externalResolver: true,
  },
};
let client;
if (!client) {
  client = new MongoClient(process.env.URI);
  await client.connect();
}
const db = client.db("testdb");

export async function POST(request) {
  const body = await request.text();
  const params = new URLSearchParams(body);
  const url = params.get("url");

  try {
    const validUrl = new URL(url);
    const numbberOfUrls = await db.collection("urls").countDocuments();
    const shortCode = numbberOfUrls+1; 
    await db.collection("urls").insertOne({
      original_url: validUrl.href,
      short_url: shortCode,
    });
    return NextResponse.json(
      { original_url: validUrl.href, short_url: shortCode },
      {
        status: 201,
        headers: { "Access-Control-Allow-Origin": "*" },
      }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid URL" },
      {
        status: 400,
        headers: { "Access-Control-Allow-Origin": "*" },
      }
    );
  }
}

