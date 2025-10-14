import { db } from ".."

export const getUserFromGoogleId = async (googleId: string) => {
    return await db
        .selectFrom("user")
        .selectAll()
        .where("google_id", "=", googleId)
        .executeTakeFirst()
}

export const createUser = async (googleId: string, email: string, name: string) => {
    return await db
        .insertInto("user")
        .values({ email, name, google_id: googleId })
        .returningAll()
        .executeTakeFirst()
}