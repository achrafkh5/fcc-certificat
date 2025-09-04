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

export const POST = async (req) => {
  try {
    const data = await req.formData(); // get the uploaded form data
    const file = data.get("upfile"); // "upfile" is the input name

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const fileInfo = {
      name: file.name,
      size: file.size,
      type: file.type,
    };
    return NextResponse.json(
      { name:fileInfo.name, type:fileInfo.type ,size: fileInfo.size },
      { headers: { "Access-Control-Allow-Origin": "*" } }
    );
  } catch {
    return NextResponse.json(
      { error: "error creating user" },
      { headers: { "Access-Control-Allow-Origin": "*" } }
    );
  }
}