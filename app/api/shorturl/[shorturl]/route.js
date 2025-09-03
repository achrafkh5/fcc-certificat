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

export async function GET(request, { params }) {
  const id = Number(params?.shorturl);
  if (isNaN(id)) return NextResponse.json({ error: "Invalid short URL id" }, { status: 400 });

  const db = await initDb();
  const urlEntry = await db.collection("urls").findOne({ short_url: id });

  if (!urlEntry) return NextResponse.json({ error: "No short URL found for the given input" }, { status: 404 });

  let redirectUrl = urlEntry.original_url;
  if (!/^https?:\/\//i.test(redirectUrl)) redirectUrl = `http://${redirectUrl}`;

  return NextResponse.redirect(redirectUrl, 307);
}
