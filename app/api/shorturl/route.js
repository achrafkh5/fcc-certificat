import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import dns from "dns";
import { promisify } from "util";

let client;
let db;

async function initDb() {
  if (!client) {
    client = new MongoClient(process.env.URI);
    await client.connect();
    db = client.db("testdb");
  }
  return db;
}

const dnsLookup = promisify(dns.lookup);

export async function POST(request) {
  const body = await request.formData();
  const url = body.get("url");

  if (!url) {
    return NextResponse.json({ error: "invalid url" });
  }

  let hostname;
  try {
    hostname = new URL(url).hostname;
  } catch {
    return NextResponse.json({ error: "invalid url" });
  }

  try {
    await dnsLookup(hostname);
  } catch {
    return NextResponse.json({ error: "invalid url" });
  }

  const db = await initDb();

  const lastEntry = await db
    .collection("urls")
    .find()
    .sort({ short_url: -1 })
    .limit(1)
    .toArray();

  const shortCode = lastEntry.length ? lastEntry[0].short_url + 1 : 1;

  await db.collection("urls").insertOne({
    original_url: url,
    short_url: shortCode,
  });

  return NextResponse.json({ original_url: url, short_url: shortCode });
}
