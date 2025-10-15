import { dev } from "$app/environment";
import { getRequestEvent } from "$app/server";

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