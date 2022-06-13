import type { RequestEvent } from "@sveltejs/kit";
import cookie from "cookie"
import { nanoid } from "nanoid"
import getDb from "@utils/db";
import type { Db } from "mongodb";

function parseCookie(cookie_str: string | null) {
    if (!cookie_str) return {}
    return cookie.parse(cookie_str)
}

async function createSessionCookie(db: Db, event: RequestEvent) {
    // Generate token
    const session_cookie = nanoid();

    let default_lang = "EN"

    // Determine default language
    let lang_header = event.request.headers.get("Accept-Language")
    if (lang_header) { 
        const header_lang = lang_header.substring(0, 2).toUpperCase();
        if (header_lang == "NL") {
            default_lang = "NL"
        }
    }

    // Add cookie to DB
    await db.collection("sessions").insertOne({
        token: session_cookie,
        lang: default_lang,
        created_at: new Date(),
        last_seen_at: new Date()
    })

    event.locals.session_cookie = session_cookie

    return session_cookie
}

const session_cookie_options = {
    httpOnly: true,
    // 5 years
    maxAge: 60 * 60 * 24 * 365 * 5
}

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({event, resolve}: {event: RequestEvent, resolve: (event: RequestEvent) => Promise<Response>}) {
    const db = await getDb();
    const cookies = parseCookie(event.request.headers.get("cookie"))
    const requested_session_token = cookies.session;

    let session_token: string
    let should_send_cookie = false

    if (requested_session_token) {
        session_token = requested_session_token
    } else {
        // This is a new user, create a cookie and send it to the user
        session_token = await createSessionCookie(db, event);
        should_send_cookie = true
    }

    // Get session data
    let session_data = await db.collection("sessions").findOne({token: session_token});

    if (!session_data) {
        // This only happens when the user has a cookie, but it can't be found in the database
        
        // Treat this user as a new user
        session_token = await createSessionCookie(db, event);
        session_data = await db.collection("sessions").findOne({token: session_token});
        should_send_cookie = true
    }

    event.locals.session_data = session_data as unknown as App.Session
    event.locals.session_token = session_token

    const response = await resolve(event)

    if (should_send_cookie) {
        // Send the created cookie to user
        response.headers.set("set-cookie", cookie.serialize("session", session_token, session_cookie_options))
    }
    return response
}

export async function getSession(event: RequestEvent) {
    const db = await getDb()
    const {session_token, session_data} = event.locals

    // The user shouldn't have to wait for this to be updated, that's why I don't await it
    db.collection("sessions").updateOne({token: session_token}, {$set: {last_seen_at: new Date()}})
        .catch(e => {
            console.error(e)
        })

    return {
        lang: session_data.lang
    }
}