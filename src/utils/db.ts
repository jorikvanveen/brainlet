import { MongoClient, Db } from "mongodb"
import "dotenv/config"

const client = new MongoClient(process.env.MONGO_CONNECT_STRING)
let cached_db: Db

export default async function getDb(): Promise<Db> {
    if (cached_db) return cached_db

    await client.connect()
    cached_db = client.db("brainlet")
    return cached_db
}