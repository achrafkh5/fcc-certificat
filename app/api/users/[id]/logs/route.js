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

export async function GET(request, { params }) {
  const id = params.id;


    if (!id) {
    return NextResponse.json(
      { error: "you need to enter them all" },
      { headers: { "Access-Control-Allow-Origin": "*" } }
    );
  }
  
  try {
    const db = await initDb();
    const getexrcises = await db.collection("fccexercices").find({ userId:new ObjectId(id) }).toArray();
    const getUser = await db.collection("fccusers").findOne({ _id: new ObjectId(id) });
    const exercises = getexrcises.map(({description,duration,date})=>({description,duration,date}));
    return NextResponse.json(
      { username: getUser.userName,_id: getUser._id, count: exercises.length,log: exercises },
      { headers: { "Access-Control-Allow-Origin": "*" } }
    );
  } catch {
    return NextResponse.json(
      { error: "error getting user",errDetails: error.message },
      { headers: { "Access-Control-Allow-Origin": "*" } }
    );
  }
}

