import getDb from "@utils/db";
import type { User } from "@utils/dbReturnTypes"
import type { ObjectID } from "bson";
import sha256 from "crypto-js/sha256";
import { nanoid } from "nanoid";

interface TokenData {
    token: string
    createdAt: Date,
    uid: ObjectID
}

export const tokens: { [key: string]: TokenData } = {}

export default async function createToken(username: string, password: string): Promise<TokenData> {
    const db = await getDb()
    const usersCollection = db.collection("users")

    const userData = await usersCollection.findOne({
        username: username
    }) as User

    // COMPARE PASSWORD

    // Hash it first
    const hashedInputPassword = sha256(password + userData.salt).toString()
    if (hashedInputPassword != userData.password) {
        throw new Error("Incorrect password")
    }

    const createdToken = nanoid()

    tokens[createdToken] = {
        token: createdToken,
        createdAt: new Date(),
        uid: userData._id
    }
    
    return tokens[createdToken]
}