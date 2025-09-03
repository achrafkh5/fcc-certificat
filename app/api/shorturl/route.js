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

// Initialize MongoDB
async function initDb() {
  if (!client) {
    client = new MongoClient(process.env.URI);
    await client.connect();
    db = client.db("testdb");
  }
  return db;
}

// POST /api/shorturl → create a short URL
export async function POST(request) {
  const body = await request.text();
  const params = new URLSearchParams(body);
  let url = params.get("url");

  if (!url) {
    return NextResponse.json(
      { error: "Missing URL" },
      { status: 400, headers: { "Access-Control-Allow-Origin": "*" } }
    );
  }

  // Add http:// if missing
  if (!/^https?:\/\//i.test(url)) {
    url = "http://" + url;
  }

  try {
    const validUrl = new URL(url); // validate URL
    const db = await initDb();

    // Count existing URLs for next short code
    const numberOfUrls = await db.collection("urls").countDocuments();
    const shortCode = numberOfUrls + 1;

    // Insert into DB
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

// GET /api/shorturl/:shorturl → redirect to original URL
export async function GET(request, { params }) {
  const id = Number(params?.shorturl);

  if (isNaN(id)) {
    return NextResponse.json(
      { error: "Invalid short URL id" },
      { status: 400, headers: { "Access-Control-Allow-Origin": "*" } }
    );
  }

  try {
    const db = await initDb();
    const urlEntry = await db.collection("urls").findOne({ short_url: id });

    if (!urlEntry) {
      return NextResponse.json(
        { error: "No short URL found for the given input" },
        { status: 404, headers: { "Access-Control-Allow-Origin": "*" } }
      );
    }

    let redirectUrl = urlEntry.original_url;

    // Ensure absolute URL
    if (!/^https?:\/\//i.test(redirectUrl)) {
      redirectUrl = `http://${redirectUrl}`;
    }

    return NextResponse.redirect(redirectUrl, 307);
  } catch (error) {
    console.error("Error fetching URL:", error);
    return NextResponse.json(
      { error: "Server Error" },
      { status: 500, headers: { "Access-Control-Allow-Origin": "*" } }
    );
  }
}
