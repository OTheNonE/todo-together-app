
import { deleteSessionTokenCookie, invalidateSession } from "$lib/server/session";
import { error, json } from "@sveltejs/kit";

export function GET({ cookies, url, locals }) {

    const { session } = locals

    if (!session) return error(401, { message: "You are already logged out." })

    invalidateSession(session.id)

    deleteSessionTokenCookie()

    return json({ result: "success" })
}