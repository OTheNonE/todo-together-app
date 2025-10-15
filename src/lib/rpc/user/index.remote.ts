import { getRequestEvent, query } from "$app/server";

export const getUser = query(async () => {
    const { locals: { session } } = getRequestEvent()

    if (!session) return undefined

    const { email, name, userId: id } = session
    return { email, name, id }
})

// export const createUser = form(
//     createUserSchema,
//     async ({ first_name, last_name, email }) => {

//         const { insertId } = await db
//             .insertInto("user")
//             .values({ first_name, last_name, email })
//             .executeTakeFirst()

//         getUsers().refresh()

//         return insertId
//     }
// )

// export const deleteUser = form(
//     deleteUserSchema,
//     async ({ id }) => {

//         const { numDeletedRows } = await db
//             .deleteFrom("user")
//             .where('id', '=', id)
//             .executeTakeFirst()

//         getUsers().refresh()

//         return numDeletedRows
//     }
// )