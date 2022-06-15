import getDb from "./db"

interface Cached<T> {
    valid: boolean,
    value: T
}

const sessions: Map<string, Cached<App.Session>> = new Map()

export async function getSessionFromToken(token: string): Promise<App.Session | null> {
    let cached_session = sessions.get(token)

    if (cached_session == undefined || !cached_session.valid) {
        const db = await getDb();
        const session_doc = await db.collection("sessions").findOne({token})

        if (!session_doc) return null
        const session: App.Session = session_doc as unknown as App.Session
        sessions.set(token, { valid: true, value: session })
        return session
    }
    
    return cached_session.value
}

export async function invalidateCachedSession(token) {
    const cached_session = sessions.get(token)
    if (!cached_session) return
    cached_session.valid = false
}