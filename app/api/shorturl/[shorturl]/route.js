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

export async function GET(request, { params }) {
  const shorturl = params?.shorturl; // from /api/shorturl/[shorturl]

  try {
    const urlEntry = await db.collection("urls").findOne({ short_url: parseInt(shorturl) });

    if (urlEntry) {
      const redirectUrl = urlEntry?.original_url?.startsWith("http")
        ? urlEntry.original_url
        : `http://${urlEntry.original_url}`;

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
