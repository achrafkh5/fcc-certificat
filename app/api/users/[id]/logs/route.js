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

export async function GET(request, { params }) {
  const id = params.id;
  const { searchParams } = new URL(request.url);

  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const limit = parseInt(searchParams.get("limit"));

  if (!id) {
    return NextResponse.json(
      { error: "Missing user ID" },
      { status: 400, headers: { "Access-Control-Allow-Origin": "*" } }
    );
  }

  try {
    const db = await initDb();
    const user = await db.collection("fccusers").findOne({ _id: new ObjectId(id) });
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404, headers: { "Access-Control-Allow-Origin": "*" } }
      );
    }

    // Build filter
    let filter = { userId: new ObjectId(id) };
    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = new Date(from);
      if (to) filter.date.$lte = new Date(to);
    }

    // Query logs
    let query = db.collection("fccexercices").find(filter);
    if (limit) query = query.limit(limit);

    const logs = await query.toArray();

    // Format logs for FCC
    const formattedLogs = logs.map(ex => ({
      description: ex.description,
      duration: Number(ex.duration),
      date: new Date(ex.date).toDateString(),
    }));

    return NextResponse.json(
      {
        username: user.userName,
        _id: user._id,
        count: formattedLogs.length,
        log: formattedLogs,
      },
      { headers: { "Access-Control-Allow-Origin": "*" } }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "error getting logs", details: error.message },
      { status: 500, headers: { "Access-Control-Allow-Origin": "*" } }
    );
  }
}
