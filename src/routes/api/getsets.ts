import type { ServerRequest } from "@sveltejs/kit/types/hooks";
import getDb from "@utils/db";

export async function get(request: ServerRequest): Promise<Record<string, unknown>> {
    const db = await getDb()
    const sets = db.collection("sets")

    console.log("querying")
    const setsQueryResult = await sets.find().sort("timestamp", -1).limit(100).toArray()

    console.log("returning")
    return {
        body: setsQueryResult
    }
}