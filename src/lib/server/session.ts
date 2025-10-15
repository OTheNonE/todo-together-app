import { db } from "./db";
import { encodeBase32, encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import { getRequestEvent } from "$app/server";
import { dev } from "$app/environment";

export const SESSION_UPDATE_MS = 1000 * 60 * 60 * 24 * 15
export const SESSION_OUTDATED_MS = 1000 * 60 * 60 * 24 * 30

export async function createSession(token: string, userId: number) {
	const sessionId = encodeSessionToken(token);

    const expiresAt = Date.now() + SESSION_OUTDATED_MS

    const session = await db
        .insertInto("session")
        .values({ expiresAt, id: sessionId, userId })
        .returningAll()
        .executeTakeFirst()

	return session;
}

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

export async function invalidateSession(sessionId: string) {
    await db
        .deleteFrom("session")
        .where("id", "=", sessionId)
        .execute()
}

export async function invalidateUserSessions(userId: number) {
    await db
        .deleteFrom("session")
        .where("userId", "=", userId)
        .execute()
}

export function setSessionTokenCookie(token: string, expiresAt: number): void {
    const { cookies, url } = getRequestEvent()

	cookies.set("session", token, {
        path: "/",
        secure: !dev || url.protocol === "https",
		expires: new Date(expiresAt)
	});
}

export function deleteSessionTokenCookie(): void {
    const { cookies, url } = getRequestEvent()

    cookies.delete("session", {
		path: "/",
        secure: !dev || url.protocol === "https",
		maxAge: 0
    })
}

export function generateSessionToken(): string {
	const tokenBytes = new Uint8Array(20);
	crypto.getRandomValues(tokenBytes);
	const token = encodeBase32(tokenBytes).toLowerCase();
	return token;
}

export function encodeSessionToken(token: string) {
    return encodeHexLowerCase(sha256(new TextEncoder().encode(token)))
}

export type Session = NonNullable<Awaited<ReturnType<typeof getValidatedSession>>>