interface DbWord {
    term: string,
    definition: string
}

interface Set {
    name: string,
    timestamp: string,
    words: DbWord[]
}

export type { Set, DbWord }