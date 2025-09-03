import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import dns from "dns/promises";

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
    return NextResponse.json({ error: "invalid url" }, { status: 400 });
  }

  // Only allow URLs starting with http:// or https://
  if (!/^https?:\/\//i.test(url)) {
    return NextResponse.json({ error: "invalid url" }, { status: 400 });
  }

  let validUrl;
  try {
    validUrl = new URL(url);
  } catch {
    return NextResponse.json({ error: "invalid url" }, { status: 400 });
  }

  // Verify that hostname exists using DNS
  try {
    await dns.lookup(validUrl.hostname);
  } catch {
    return NextResponse.json({ error: "invalid url" }, { status: 400 });
  }

  const db = await initDb();

  // Generate next short_url starting at 1
  const lastEntry = await db
    .collection("urls")
    .find()
    .sort({ short_url: -1 })
    .limit(1)
    .toArray();

  const shortCode = lastEntry.length ? lastEntry[0].short_url + 1 : 1;

  await db.collection("urls").insertOne({
    original_url: validUrl.href,
    short_url: shortCode,
  });

  return NextResponse.json(
    { original_url: validUrl.href, short_url: shortCode },
    { status: 201, headers: { "Access-Control-Allow-Origin": "*" } }
  );
}
