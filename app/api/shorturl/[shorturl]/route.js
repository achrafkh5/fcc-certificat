import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

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
  const id = Number(params.shorturl);

  if (isNaN(id)) {
    return NextResponse.json(
      { error: "No short URL found for the given input" },
      { headers: { "Access-Control-Allow-Origin": "*" } }
    );
  }

  const db = await initDb();
  const urlEntry = await db.collection("urls").findOne({ short_url: id });

  if (!urlEntry) {
    return NextResponse.json(
      { error: "No short URL found for the given input" },
      { headers: { "Access-Control-Allow-Origin": "*" } }
    );
  }

  return NextResponse.redirect(urlEntry.original_url, 302);
}
