import type Kit from "@sveltejs/kit";
import getDb from "@utils/db";

export async function get(_request: Kit.RequestEvent): Promise<Record<string, unknown>> {
    const db = await getDb()
    const sets = db.collection("sets")

    const setsQueryResult = await sets.find().sort("timestamp", -1).limit(100).toArray()

    return {
        body: setsQueryResult
    }
}