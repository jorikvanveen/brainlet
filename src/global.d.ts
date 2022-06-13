/// <reference types="@sveltejs/kit" />

declare namespace App {
    interface Locals {
        session_token: string
        session_data: App.Session
    }
    interface Platform {}
    interface Session {
        id: string
        lang: string
    }
    interface Stuff {}
}