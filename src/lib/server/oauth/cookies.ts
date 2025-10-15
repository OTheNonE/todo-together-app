import { dev } from "$app/environment";
import { getRequestEvent } from "$app/server";

export function setStateCookie(state: string) {
    const { cookies, url } = getRequestEvent()

    cookies.set("oauth_state", state, {
        maxAge: 60 * 10,
        secure: !dev || url.protocol === "https",
        path: "/",
    });
}

export function setCodeVerifierCookie(codeVerifier: string) {
    const { cookies, url } = getRequestEvent()

    cookies.set("code_verifier", codeVerifier, {
        maxAge: 60 * 10,
        secure: !dev || url.protocol === "https",
        path: "/",
    });
}

export function getStateCookie() {
    const { cookies } = getRequestEvent()

    return cookies.get("oauth_state") ?? null;

}

export function getCodeVerifierCookie() {
    const { cookies } = getRequestEvent()
    
    return cookies.get("code_verifier") ?? null;
}

export function deleteStateCookie() {
    const { cookies, url } = getRequestEvent()

    cookies.delete("oauth_state", {
        secure: !dev || url.protocol === "https",
        path: "/",
    })
}

export function deleteCodeVerifierCookie() {
    const { cookies, url } = getRequestEvent()
    
    cookies.delete("code_verifier", {
        secure: !dev || url.protocol === "https",
        path: "/",
    })
}
