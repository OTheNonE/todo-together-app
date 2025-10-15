import { redirect } from "@sveltejs/kit";
import { createSession } from "$lib/server/session";
import { handleLoginCallback, google, google_claims_schema } from "$lib/server/oauth";
import { getOrCreateUser } from "$lib/server/user";

export async function GET() {
	const { email, name } = await handleLoginCallback(google, google_claims_schema)

	const { id } = await getOrCreateUser({ email, name })

	await createSession(id);

	redirect(307, "/");
}