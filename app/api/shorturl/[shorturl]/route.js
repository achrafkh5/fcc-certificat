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

export async function GET(request, { params }) {
  const id = Number(params?.shorturl);

  if (isNaN(id)) {
    return NextResponse.json(
      { error: "invalid url" },
      { status: 400, headers: { "Access-Control-Allow-Origin": "*" } }
    );
  }

  const db = await initDb();
  const urlEntry = await db.collection("urls").findOne({ short_url: id });

  if (!urlEntry) {
    return NextResponse.json(
      { error: "invalid url" },
      { status: 404, headers: { "Access-Control-Allow-Origin": "*" } }
    );
  }

  // Redirect with 302; headers can’t be sent with redirect
  return NextResponse.redirect(urlEntry.original_url, 302);
}


