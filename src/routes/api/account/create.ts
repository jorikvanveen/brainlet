import type { ServerRequest } from "@sveltejs/kit/types/hooks"
import getDb from "@utils/db"
import sha256 from "crypto-js/sha256.js"
import { nanoid } from "nanoid"
import createToken from "@utils/_createToken"

const errorResponse = {
    status: 400,
    body: {
        success: false
    }
}

export async function post(request: ServerRequest): Promise<Record<string, unknown>> {
    const db = await getDb()
    const body = request.body as {[key: string]: any}

    // Sanitize user input
    const username = body.username as string
    const password = body.password as string

    const usersCollection = db.collection("users")

    // Hash password
    const salt = nanoid()
    const hashed = sha256(password + salt).toString()

    const userDoc = await usersCollection.insertOne({
        username: username,
        password: hashed,
        salt: salt
    })

    // Create token for user
    const token = await createToken(username, password)
    
    return {
        body: {
            success: true,
            token: token.token,
            uid: userDoc.insertedId.toString()
        }
    }
}