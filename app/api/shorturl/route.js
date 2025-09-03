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

  try {
    let normalizedUrl = url;
if (!/^https?:\/\//i.test(url)) {
  normalizedUrl = "https://" + url;
}
const validUrl = new URL(normalizedUrl); 
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
  } catch (error) {
    console.error("Error processing URL:", error);
    return NextResponse.json(
      { error: "Invalid URL" },
      { status: 400, headers: { "Access-Control-Allow-Origin": "*" } }
    );
  }
}
