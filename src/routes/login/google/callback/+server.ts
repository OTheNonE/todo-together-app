import { error, redirect } from "@sveltejs/kit";

import { decodeIdToken } from "arctic";
import type { OAuth2Tokens } from "arctic";

import { createUser, getUserFromGoogleId } from "$lib/server/db/query/auth";
import { createSession, generateSessionToken, setSessionTokenCookie } from "$lib/server/session";
import { google, google_schema } from "$lib/server/oauth/google";
import { dev } from "$app/environment";

export async function GET({ cookies, url }) {
	const storedState = cookies.get("google_oauth_state") ?? null;
	const codeVerifier = cookies.get("google_code_verifier") ?? null;
	const code = url.searchParams.get("code");
	const state = url.searchParams.get("state");

	cookies.delete("google_oauth_state", {
		secure: !dev || url.protocol === "https",
		path: "/",
	})

	cookies.delete("google_code_verifier", {
		secure: !dev || url.protocol === "https",
		path: "/",
	})

	if (storedState === null || codeVerifier === null || code === null || state === null) {
		error(400, {message: "Please restart the process." });
	}
	if (storedState !== state) {
		error(400, { message: "Please restart the process." });
	}

	let tokens: OAuth2Tokens;
	try {
		tokens = await google.validateAuthorizationCode(code, codeVerifier);
	} catch (e) {
		error(400, { message: "Please restart the process." });
	}

	const claims = decodeIdToken(tokens.idToken());

	const { sub: googleId, name, email } = google_schema.parse(claims)

	console.log(googleId, email, name)

	let user = await getUserFromGoogleId(googleId);

	if (!user) {
		user = await createUser(googleId, email, name);
		if (!user) error(400, { message: "Please restart the process." });
	}

	const sessionToken = generateSessionToken();
	const session = await createSession(sessionToken, user.id);
    if (!session) error(400, { message: "Please restart the process." });
	setSessionTokenCookie(sessionToken, session.expiresAt);
	redirect(307, "/");
}