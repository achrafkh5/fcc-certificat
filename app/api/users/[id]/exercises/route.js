import { NextResponse } from "next/server";
import { MongoClient,ObjectId } from "mongodb";

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

export async function POST(request, { params }) {
  const body = await request.text();
  const formData = new URLSearchParams(body);

  const description = formData.get("description");
  const duration = formData.get("duration");
  const dat = formData.get("date");
  const id = params.id;


    if (!id || !description || !duration) {
    return NextResponse.json(
      { error: "you need to enter them all" },
      { headers: { "Access-Control-Allow-Origin": "*" } }
    );
  }
  let date;
  if(!dat){
    date = new Date().toDateString();
  } else{
    date = new Date(dat).toDateString();
  }

  try {
    const db = await initDb();
    const user = await db.collection("fccusers").findOne({ _id: new ObjectId(id) });
    await db.collection("fccexercices").insertOne({ userId: new ObjectId(id), description, duration: Number(duration), date, username: user.userName });
    const getUser = await db.collection("fccusers").findOne({ _id: new ObjectId(id) });
    return NextResponse.json(
      {
        username: user.username,
        description,
        duration: Number(duration),
        date,
        _id: user._id
      },
      { headers: { "Access-Control-Allow-Origin": "*" } }
    );
  } catch {
    return NextResponse.json(
      { error: "error creating user",errDetails: error.message },
      { headers: { "Access-Control-Allow-Origin": "*" } }
    );
  }
}

export async function GET(request, { params }) {
  return NextResponse.json(
    { message: `GET request received for user ID: ${params.id}` },
    { headers: { "Access-Control-Allow-Origin": "*" } }
  );
}
