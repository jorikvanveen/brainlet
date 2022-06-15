import type { RequestEvent } from "@sveltejs/kit";

export async function get(_request: RequestEvent) {
    throw new Error("Some random error")
}