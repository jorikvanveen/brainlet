/// <reference types="@sveltejs/kit" />

declare namespace App {
    interface Locals {
        session_cookie: string | null
    }
    interface Platform {}
    interface Session {}
    interface Stuff {}
}