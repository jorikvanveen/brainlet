import type { ServerRequest } from "@sveltejs/kit/types/hooks";
import getDb from "@utils/db";
import { ObjectId } from "bson";

export async function get(request: ServerRequest): Promise<Record<string, unknown>> {
    const db = await getDb()
    const sets = db.collection("sets")

    const requestedSet = await sets.findOne({_id: new ObjectId(request.params.set_id)})


    return {
        body: {
            success: true,
            set: requestedSet
        }
    }
}