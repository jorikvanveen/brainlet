import { MongoClient, Db } from "mongodb"
import "dotenv/config"

const client = new MongoClient(process.env.MONGO_CONNECT_STRING)

export default async function getDb(): Promise<Db> {
    await client.connect()
    return client.db("brainlet")
}