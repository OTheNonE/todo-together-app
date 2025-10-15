
import { invalidateSession } from "$lib/server/session";
import { redirect } from "@sveltejs/kit";

export async function GET() {

    await invalidateSession()

    redirect(302, "/")
}