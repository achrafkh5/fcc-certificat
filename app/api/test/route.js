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

export async function DELETE() {
  try {
    const db = await initDb();
    const result = await db.collection("fccusers").deleteMany({});
    return NextResponse.json(
      { message: "All URLs deleted", deletedCount: result.deletedCount },
      { status: 200, headers: { "Access-Control-Allow-Origin": "*" } }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to clear URLs", details: error.message },
      { status: 500, headers: { "Access-Control-Allow-Origin": "*" } }
    );
  }
}

export async function GET() {
  try {
    const db = await initDb();
    const result = await db.collection("fccusers").find({}).toArray();
    return NextResponse.json(
      { users: result },
      { status: 200, headers: { "Access-Control-Allow-Origin": "*" } }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to clear URLs", details: error.message },
      { status: 500, headers: { "Access-Control-Allow-Origin": "*" } }
    );
  }
}
