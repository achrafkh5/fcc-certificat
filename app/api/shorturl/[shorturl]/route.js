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
    return new Response(JSON.stringify({ error: "invalid url" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const db = await initDb();
  const urlEntry = await db.collection("urls").findOne({ short_url: id });

  if (!urlEntry) {
    return new Response(JSON.stringify({ error: "No short URL found for the given input" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  // ✅ pure redirect with no body
  return new Response(undefined, {
    status: 200,
    headers: {
      Location: urlEntry.original_url,
    },
  });
}
