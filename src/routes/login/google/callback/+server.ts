import { google } from "$lib/server/oauth";
import { error, redirect } from "@sveltejs/kit";
import { decodeIdToken } from "arctic";

import type { OAuth2Tokens } from "arctic";
import { createUser, getUserFromGoogleId } from "$lib/server/db/query/auth";
import { createSession, generateSessionToken, setSessionTokenCookie } from "$lib/server/session";

export async function GET({ cookies, url }) {
	const storedState = cookies.get("google_oauth_state") ?? null;
	const codeVerifier = cookies.get("google_code_verifier") ?? null;
	const code = url.searchParams.get("code");
	const state = url.searchParams.get("state");

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

	const claims: any = decodeIdToken(tokens.idToken());

	console.log(claims)

	const googleId = claims["sub"];
	const name = claims["name"];
	const email = claims["email"];

	let user = await getUserFromGoogleId(googleId);

	if (!user) {
		user = await createUser(googleId, email, name);
		if (!user) error(400, { message: "Please restart the process." });
	}

	const sessionToken = generateSessionToken();
	const session = await createSession(sessionToken, user.id);
    if (!session) error(400, { message: "Please restart the process." });
	setSessionTokenCookie(sessionToken, session.expires_at);
	redirect(307, "/");
}