import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

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
  if (!dat) {
    date = new Date();  // ✅ save Date object
  } else {
    date = new Date(dat); // ✅ save Date object from yyyy-mm-dd
  }

  try {
    const db = await initDb();
    const user = await db.collection("fccusers").findOne({ _id: new ObjectId(id) });
    await db.collection("fccexercices").insertOne({
      userId: new ObjectId(id),
      description,
      duration: Number(duration),
      date, // ✅ store Date object, not string
      username: user.userName,
    });

    return NextResponse.json(
      {
        username: user.userName,
        description,
        duration: Number(duration),
        date: date.toDateString(), // ✅ return string format
        _id: user._id,
      },
      { headers: { "Access-Control-Allow-Origin": "*" } }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "error creating exercise", errDetails: error.message },
      { headers: { "Access-Control-Allow-Origin": "*" } }
    );
  }
}

