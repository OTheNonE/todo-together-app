import { form, query } from "$app/server";
import { db } from "$lib/server/database";
import { createUserSchema, deleteUserSchema } from "./schema";



export const getUser = query(async () => {

})


export const getUsers = query(async () => {
    
    const result = await db
        .selectFrom("user")
        .select(["id", "email", "first_name", "last_name"])
        .execute()

    return result
})

export const createUser = form(
    createUserSchema,
    async ({ first_name, last_name, email }) => {

        const { insertId } = await db
            .insertInto("user")
            .values({ first_name, last_name, email })
            .executeTakeFirst()

        getUsers().refresh()

        return insertId
    }
)

export const deleteUser = form(
    deleteUserSchema,
    async ({ id }) => {

        const { numDeletedRows } = await db
            .deleteFrom("user")
            .where('id', '=', id)
            .executeTakeFirst()

        getUsers().refresh()

        return numDeletedRows
    }
)