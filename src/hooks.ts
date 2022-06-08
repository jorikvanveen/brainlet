import type { RequestEvent } from "@sveltejs/kit";
import geoip from "geoip-lite"
import cookie from "cookie"
import { nanoid } from "nanoid"
import getDb from "@utils/db";

function parseCookie(cookie_str: string | null) {
    if (!cookie_str) return {}
    return cookie.parse(cookie_str)
}

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({event, resolve}: {event: RequestEvent, resolve: (event: RequestEvent) => Promise<Response>}) {
    const db = await getDb();
    // Check if user has a session
    const cookies = parseCookie(event.request.headers.get("cookie"))

    let session_cookie = cookies.session
    let is_cookie_on_user_machine = true

    if (!cookies.session) {
        is_cookie_on_user_machine = false
        // Generate token
        session_cookie = nanoid();

        let default_lang = "EN"

        // Determine default language
        try {
            const ip = event.clientAddress;
            const location = geoip.lookup(ip)
            if (location?.country === "NL") {
                default_lang = "NL"
            }
        } catch (e) {
            console.warn("Failed to determine geolocation (ignore this warning during prerendering)")
            console.warn(e)
        }

        // Add cookie to DB
        await db.collection("sessions").insertOne({
            token: session_cookie,
            lang: default_lang
        })

        event.locals.session_cookie = session_cookie
    }
    const response = await resolve(event)

    if (!is_cookie_on_user_machine) {
        // Send cookie to user
        console.log("Setting cookie")
        response.headers.set("set-cookie", cookie.serialize("session", session_cookie, {
            secure: true,
            httpOnly: true,
            // 5 years
            maxAge: 60 * 60 * 24 * 365 * 5
        }))
    }

    return response
}

export async function getSession(event: RequestEvent) {
    const db = await getDb()
    const cookies = parseCookie(event.request.headers.get("cookie"))
    let session_id = cookies.session

    if (!session_id) {
        session_id = event.locals.session_cookie
    }

    const session_data = await db.collection("sessions").findOne({token: session_id})
    console.log(session_data.lang)
    return {
        lang: session_data.lang
    }
}