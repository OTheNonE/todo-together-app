
import { invalidateSession } from "$lib/server/session";
import { error, json } from "@sveltejs/kit";

export function GET() {

    invalidateSession()

    return json({ result: "success" })
}