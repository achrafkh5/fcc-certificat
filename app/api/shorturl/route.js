// app/api/shorturl/route.js
import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

let client;
let db;
export const config = {
  api: {
    externalResolver: true,
  },
};
async function initDb() {
  if (!client) {
    client = new MongoClient(process.env.URI);
    await client.connect();
    db = client.db("testdb");
  }
  return db;
}

export async function POST(request) {
  const body = await request.text();
  const params = new URLSearchParams(body);
  const url = params.get("url");

  if (!url) {
    return NextResponse.json({ error: "invalid url" },
      { status: 400, headers: { "Access-Control-Allow-Origin": "*" } });
  }

  let validUrl;
  try {
    validUrl = new URL(url); // throws if invalid
  } catch {
    return NextResponse.json({ error: "invalid url" }, 
      { status: 400, headers: { "Access-Control-Allow-Origin": "*" } });
  }

  const db = await initDb();

  // Get next short code
  const lastEntry = await db.collection("urls").find().sort({ short_url: -1 }).limit(1).toArray();
  const shortCode = lastEntry.length ? lastEntry[0].short_url + 1 : 1;

  await db.collection("urls").insertOne({
    original_url: validUrl.href,
    short_url: shortCode,
  });

  return NextResponse.json({ original_url: validUrl.href, short_url: shortCode },
      { status: 201, headers: { "Access-Control-Allow-Origin": "*" } }
    );
}
