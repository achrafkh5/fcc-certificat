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

export async function POST(request) {
  const body = await request.text();
  const params = new URLSearchParams(body);
  const userName = params.get("username");

    if (!userName) {
    return NextResponse.json(
      { error: "you need to enter a username" },
      { headers: { "Access-Control-Allow-Origin": "*" } }
    );
  }
  
  try {
    const db = await initDb();
    await db.collection("fccusers").insertOne({ userName });
    const getUser = await db.collection("fccusers").findOne({ userName });
    return NextResponse.json(
      { userName: getUser.userName, _id: getUser._id },
      { headers: { "Access-Control-Allow-Origin": "*" } }
    );
  } catch {
    return NextResponse.json(
      { error: "error creating user" },
      { headers: { "Access-Control-Allow-Origin": "*" } }
    );
  }
}

export async function GET() {
  try {
    const db = await initDb();
    const result = await db.collection("fccusers").find({}).toArray();
    return NextResponse.json(result,
      { status: 200, headers: { "Access-Control-Allow-Origin": "*" } }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "error fetching users", details: error.message },
      { status: 500, headers: { "Access-Control-Allow-Origin": "*" } }
    );
  }
}

