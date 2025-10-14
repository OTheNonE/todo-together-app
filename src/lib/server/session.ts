import { db } from "./db";
import { encodeBase32, encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import { getRequestEvent } from "$app/server";
import { dev } from "$app/environment";

export const SESSION_UPDATE_MS = 1000 * 60 * 60 * 24 * 15
export const SESSION_OUTDATED_MS = 1000 * 60 * 60 * 24 * 30

export async function validateSessionToken(token: string) {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

    const session = await db
        .selectFrom("session")
        .innerJoin("user", "user.id", "session.user_id")
        .select(["user.email", "user.name", "user.id as user_id", "session.expires_at", "session.id"])
        .where("id", "=", sessionId)
        .executeTakeFirst()

	if (!session) {
		return undefined;
	}

	if (Date.now() >= session.expires_at) {
        await db
            .deleteFrom("session")
            .where("id", "=", session.id)
            .executeTakeFirst()

		return undefined;
	}
	if (Date.now() >= session.expires_at - SESSION_UPDATE_MS) {

		session.expires_at = Date.now() + SESSION_OUTDATED_MS;

        await db
            .updateTable("session")
            .set({ expires_at: session.expires_at })
            .where("id", "=", session.id)
            .execute()
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
        .where("user_id", "=", userId)
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

export async function createSession(token: string, user_id: number) {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
    const expires_at = Date.now() + SESSION_OUTDATED_MS

    const session = await db
        .insertInto("session")
        .values({ expires_at, id: sessionId, user_id })
        .returningAll()
        .executeTakeFirst()

	return session;
}