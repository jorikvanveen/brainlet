import type { RequestEvent } from "@sveltejs/kit"
import getDb from "@utils/db"
import cookie from "cookie"

const errorResponse = {
    status: 400,
    body: {
        success: false
    }
}

const invalidSessionResponse = {
    body: {
        success: false,
        message: "Invalid session"
    },
    status: 400 
}

export async function post(event: RequestEvent): Promise<Record<string, unknown>> {
    const db = await getDb()
    const body = await event.request.json() as {[key: string]: any}
    const session_token = cookie.parse(event.request.headers.get("cookie")).session

    if (!session_token) return invalidSessionResponse
    // Check if session exists
    const session_data = await db.collection("sessions").findOne({token: session_token})

    if (!session_data) return invalidSessionResponse 

    // Sanitize user input
    if (body.name == "") return errorResponse
    
    const newDocument = {
        name: body.name,
        words: [],
        timestamp: new Date(),
        owner: session_data._id.toString()
    }

    for (const word of body.words_array) {
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