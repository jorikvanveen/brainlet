import type { ServerRequest } from "@sveltejs/kit/types/hooks"
import getDb from "@utils/db"

const errorResponse = {
    status: 400,
    body: {
        success: false
    }
}

export async function post(request: ServerRequest): Promise<Record<string, unknown>> {
    const db = await getDb()
    const body = request.body as {[key: string]: any}
    console.log(body)

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

    await db.collection("sets").insertOne(newDocument)

    return {
        body: {
            success: true
    
        }
    }
}