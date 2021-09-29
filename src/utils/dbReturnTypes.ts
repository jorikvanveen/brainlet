import type { ObjectID } from "bson"
interface DbWord {
    term: string,
    definition: string
}

interface Set {
    name: string,
    timestamp: string,
    words: DbWord[]
}

interface User {
    _id: ObjectID,
    username: string,
    password: string,
    salt: string
}

export type { Set, DbWord, User }