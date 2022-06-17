import { browser } from "$app/env";
import type { RequestEvent } from "@sveltejs/kit";

export async function get(_request: RequestEvent): Promise<Record<string, unknown>> {
    if (!browser) {
        throw new Error("Some random error")
    }

    return {
        body: {
            epicness: true
        }
    }
}