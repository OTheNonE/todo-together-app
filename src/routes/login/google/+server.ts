import { redirectToLogin, google } from "$lib/server/oauth";

export const GET = () => redirectToLogin(google)