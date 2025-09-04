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
  const { searchParams } = new URL(request.url);
const from = searchParams.get("from");
const to = searchParams.get("to");
const limit = parseInt(searchParams.get("limit"));



    if (!id) {
    return NextResponse.json(
      { error: "you need to enter them all" },
      { headers: { "Access-Control-Allow-Origin": "*" } }
    );
  }
  let filter = { userId: new ObjectId(id) };



  
  try {
    if (from || to) {
    filter.date = {};
    if (from) filter.date.$gte = new Date(from).toDateString();
    if (to) filter.date.$lte = new Date(to).toDateString();

    const db = await initDb();
    const getexrcises = await db.collection("fccexercices").find({ userId:new ObjectId(id) }).toArray();
    const getUser = await db.collection("fccusers").findOne({ _id: new ObjectId(id) });
    let exercises = getexrcises.map(({description,duration,date})=>({description,duration,date}));
    let query = db.collection("fccexercices").find(filter);
    if (limit) query = query.limit(limit);

     if(from||to||limit){exercises = await query.toArray();}

    return NextResponse.json(
      { username: getUser.userName,_id: getUser._id, count: exercises.length,log: exercises },
      { headers: { "Access-Control-Allow-Origin": "*" } }
    );
  }} catch {
    return NextResponse.json(
      { error: "error getting user",errDetails: error.message },
      { headers: { "Access-Control-Allow-Origin": "*" } }
    );
  }
}

