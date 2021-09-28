import { MongoClient, Db } from "mongodb"
import { MONGO_CONNECT_STRING } from "./env"

const client = new MongoClient(MONGO_CONNECT_STRING)

export default async function getDb(): Promise<Db> {
    await client.connect()
    return client.db("brainlet")
}