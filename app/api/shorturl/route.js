import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

let client;
let db;

export const config = {
  api: { externalResolver: true },
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
  const { url } = await request.json();
  if (!url) return NextResponse.json({ error: "Missing URL" }, { status: 400 });

  let validUrl;
  try {
    validUrl = new URL(/^https?:\/\//i.test(url) ? url : `http://${url}`);
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  const db = await initDb();
  const numberOfUrls = await db.collection("urls").countDocuments();
  const shortCode = numberOfUrls + 1;

  await db.collection("urls").insertOne({
    original_url: validUrl.href,
    short_url: shortCode,
  });

  return NextResponse.json(
    { original_url: validUrl.href, short_url: shortCode },
    { status: 201, headers: { "Access-Control-Allow-Origin": "*" } }
  );
}
