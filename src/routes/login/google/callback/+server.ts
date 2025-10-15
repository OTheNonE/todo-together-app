import { error, redirect } from "@sveltejs/kit";
import { createSession } from "$lib/server/session";
import { handleLoginCallback, google, google_claims_schema } from "$lib/server/oauth";
import { createUser, getUserFromGoogleId } from "$lib/server/db/query/auth";

export async function GET() {
	const { email, name, sub: googleId } = await handleLoginCallback(google, google_claims_schema)

	let user = await getUserFromGoogleId(googleId);

	if (!user) {
		user = await createUser(googleId, email, name);
		if (!user) error(400, { message: "Please restart the process." });
	}

	await createSession(user.id);

	redirect(307, "/");
}