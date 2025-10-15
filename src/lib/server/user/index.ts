import { db } from "$lib/server/db"
import { error } from "@sveltejs/kit"


export const getUserByEmail = async (email: string) => {
    return await db
        .selectFrom("user")
        .selectAll()
        .where("email", "=", email)
        .executeTakeFirst()
}

export const createUser = async (values: { email: string, name: string }) => {
    return await db
        .insertInto("user")
        .values(values)
        .returningAll()
        .executeTakeFirst()
}

export const getOrCreateUser = async (values: { email: string, name: string }) => {

    const { email, name } = values

	let user = await getUserByEmail(email);

	if (!user) {
		user = await createUser({ email, name });
		if (!user) error(400, { message: "Please restart the process." });
	}

    return user
}