import { db } from "$lib/server/db";
import { getRequestEvent } from "$app/server";
import { error } from "@sveltejs/kit";
import { deleteSessionTokenCookie, setSessionTokenCookie } from "./cookies";
import { encodeSessionToken, generateSessionToken } from "./token";

export const SESSION_UPDATE_MS = 1000 * 60 * 60 * 24 * 15
export const SESSION_OUTDATED_MS = 1000 * 60 * 60 * 24 * 30

// Login
export async function createSession(userId: number) {

    const token = generateSessionToken()

	const sessionId = encodeSessionToken(token);

    const expiresAt = Date.now() + SESSION_OUTDATED_MS

    const session = await db
        .insertInto("session")
        .values({ expiresAt, id: sessionId, userId })
        .returningAll()
        .executeTakeFirst()

    if (!session) error(400, { message: "Please restart the process." })
        
	setSessionTokenCookie(token, session.expiresAt);

	return session;
}

// Handle
export async function getValidatedSession() {
    const { cookies } = getRequestEvent()

    const token = cookies.get("session")
    if (!token) return undefined

	const sessionId = encodeSessionToken(token);

    const session = await db
        .selectFrom("session")
        .innerJoin("user", "user.id", "session.userId")
        .select([
            "session.id",
            "session.expiresAt",
            "user.id as userId",
            "user.email",
            "user.name",
        ])
        .where("session.id", "=", sessionId)
        .executeTakeFirst()

	if (!session) {
        deleteSessionTokenCookie()
        return undefined
    }

	if (Date.now() >= session.expiresAt) {
        await db
            .deleteFrom("session")
            .where("id", "=", session.id)
            .executeTakeFirst()

        deleteSessionTokenCookie()

		return undefined;
	}

	if (Date.now() >= session.expiresAt - SESSION_UPDATE_MS) {

		session.expiresAt = Date.now() + SESSION_OUTDATED_MS;

        await db
            .updateTable("session")
            .set({ expiresAt: session.expiresAt })
            .where("id", "=", session.id)
            .execute()

        setSessionTokenCookie(token, session.expiresAt)
	}

	return session;
}

// Logout
export async function invalidateSession() {
    const { locals } = getRequestEvent()

    const { session } = locals

    if (!session) return error(401, { message: "You are already logged out." })

    await db
        .deleteFrom("session")
        .where("id", "=", session.id)
        .execute()

    deleteSessionTokenCookie()
    
}

// Logout everywhere
export async function invalidateUserSessions(userId: number) {
    await db
        .deleteFrom("session")
        .where("userId", "=", userId)
        .execute()
}

export type Session = NonNullable<Awaited<ReturnType<typeof getValidatedSession>>>