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
  
  try {
    const db = await initDb();
    const getexrcises = await db.collection("fccexercices").find({ userId:new ObjectId(id) }).toArray();
    const getUser = await db.collection("fccusers").findOne({ _id: new ObjectId(id) });
    const exercises = getexrcises.map(({description,duration,date})=>({description,duration,date}));
    let filteredExercises = exercises;
    if(from){
      const fromDate = new Date(from);
      filteredExercises = filteredExercises.filter(exercise => new Date(exercise.date) >= fromDate);
    } 
    if(to){
      const toDate = new Date(to);
      filteredExercises = filteredExercises.filter(exercise => new Date(exercise.date) <= toDate);
    }
    if(limit){
      filteredExercises = filteredExercises.slice(0, limit);
    }
    return NextResponse.json(
      { username: getUser.userName,_id: getUser._id, count: filteredExercises.length,log: filteredExercises },
      { headers: { "Access-Control-Allow-Origin": "*" } }
    );
  } catch {
    return NextResponse.json(
      { error: "error getting user",errDetails: error.message },
      { headers: { "Access-Control-Allow-Origin": "*" } }
    );
  }
}

