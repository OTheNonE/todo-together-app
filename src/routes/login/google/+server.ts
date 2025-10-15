import { dev } from "$app/environment";
import { redirect } from "@sveltejs/kit";

import { generateCodeVerifier, generateState } from "arctic";

import { google } from "$lib/server/oauth/google/client";

export function GET({ cookies, url }) {
	const state = generateState();
	const codeVerifier = generateCodeVerifier();
	const authorizationUrl = google.createAuthorizationURL(
		state, 
		codeVerifier, 
		["openid", "profile", "email"]
	);

	cookies.set("google_oauth_state", state, {
		maxAge: 60 * 10,
		secure: !dev || url.protocol === "https",
		path: "/",
	});

	cookies.set("google_code_verifier", codeVerifier, {
		maxAge: 60 * 10,
		secure: !dev || url.protocol === "https",
		path: "/",
	});

    redirect(307, authorizationUrl)
}