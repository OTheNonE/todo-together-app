import { getRequestEvent } from "$app/server";
import { error, redirect } from "@sveltejs/kit";
import { decodeIdToken, generateCodeVerifier, generateState, Google, OAuth2Tokens } from "arctic";
import type { ZodType } from "zod";
import { deleteCodeVerifierCookie, deleteStateCookie, getCodeVerifierCookie, getStateCookie, setCodeVerifierCookie, setStateCookie } from "./cookies";

type OAuth2Client = Pick<Google, "createAuthorizationURL" | "validateAuthorizationCode">

export function redirectToLogin(client: OAuth2Client) {

    const state = generateState();
    const codeVerifier = generateCodeVerifier();
    const authorizationUrl = client.createAuthorizationURL(
        state, 
        codeVerifier, 
        ["openid", "profile", "email"]
    );

    setStateCookie(state)
    setCodeVerifierCookie(codeVerifier)

    redirect(307, authorizationUrl)
}

export async function handleLoginCallback<T extends ZodType>(client: OAuth2Client, parsing_schema: T) {
    const { url } = getRequestEvent()

    const storedState = getStateCookie();
    const codeVerifier = getCodeVerifierCookie();
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");

    deleteStateCookie()
    deleteCodeVerifierCookie()

    if (storedState === null || codeVerifier === null || code === null || state === null) {
        error(400, { message: "Please restart the process." });
    }
    if (storedState !== state) {
        error(400, { message: "Please restart the process." });
    }

    let tokens: OAuth2Tokens;
    try {
        tokens = await client.validateAuthorizationCode(code, codeVerifier);
    } catch (e) {
        error(400, { message: "Please restart the process." });
    }

    const claims = decodeIdToken(tokens.idToken());

    const user = parsing_schema.parse(claims)

    return user
}