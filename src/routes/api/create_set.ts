import type { RequestEvent } from "@sveltejs/kit"
import getDb from "@utils/db"

const errorResponse = {
    status: 400,
    body: {
        success: false
    }
}

export async function post(event: RequestEvent): Promise<Record<string, unknown>> {
    const db = await getDb()
    const body = await event.request.json() as {[key: string]: any}

    // Sanitize user input
    if (body.name == "") return errorResponse
    
    const newDocument = {
        name: body.name,
        words: [],
        timestamp: new Date()
    }

    for (const word of body.words) {
        if (word.term == "" || word.definition == "") continue
        newDocument.words.push({
            term: word.term,
            definition: word.definition
        })
    }

    const writeResult = await db.collection("sets").insertOne(newDocument)

    return {
        body: {
            success: true,
            writeId: writeResult.insertedId
        }
    }
}