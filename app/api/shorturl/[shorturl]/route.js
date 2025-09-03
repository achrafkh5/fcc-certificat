import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

export const config = {
  api: {
    externalResolver: true,
  },
};

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

    if (urlEntry) {
      let redirectUrl = urlEntry.original_url;

      // Ensure absolute URL
      if (!redirectUrl.startsWith("http://") && !redirectUrl.startsWith("https://")) {
        redirectUrl = `http://${redirectUrl}`;
      }

      return NextResponse.redirect(redirectUrl, 307);
    } else {
      return NextResponse.json(
        { error: "No short URL found for the given input" },
        { status: 404, headers: { "Access-Control-Allow-Origin": "*" } }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Server Error" },
      { status: 500, headers: { "Access-Control-Allow-Origin": "*" } }
    );
  }
}
