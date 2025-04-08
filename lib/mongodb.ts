import { MongoClient, type Db } from "mongodb"

let cachedClient: MongoClient | null = null
let cachedDb: Db | null = null

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  const uri = process.env.MONGODB_URI

  if (!uri) {
    throw new Error("Please define the MONGODB_URI environment variable")
  }

  const client = new MongoClient(uri)
  await client.connect()

  const db = client.db(process.env.MONGODB_DB || "expense-tracker")

  cachedClient = client
  cachedDb = db

  return { client, db }
}

