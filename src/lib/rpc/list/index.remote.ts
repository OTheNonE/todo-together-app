import { form, getRequestEvent, query } from "$app/server";
import { db } from "$lib/server/db";
import { fail } from "@sveltejs/kit";
import { createListSchema, deleteListSchema, selectListSchema, updateListSchema } from "./schema";

export const getLists = query(async () => {
    const result = await db
        .selectFrom("list")
        .selectAll()
        .execute()

    return result
})

export const getList = query(selectListSchema, async ({ id }) => {
    const result = await db
        .selectFrom("list")
        .where("id", "==", id)
        .selectAll()
        .executeTakeFirst()

    return result
})

export const createList = form(createListSchema, async (values) => {
    const { locals } = getRequestEvent()

    const { session } = locals
    if (!session) return fail(404, { message: "You are not logged in." })

    const { userId } = session

    const list = await db
        .transaction()
        .execute(async tx => {

            const list = await tx
                .insertInto("list")
                .values(values)
                .returningAll()
                .executeTakeFirst()

            if (!list) return fail(404, { message: "Could not create list." })

            const membership = await tx
                .insertInto("memberOfList")
                .values({ userId, listId: list?.id, role: "owner" })
                .returningAll()
                .executeTakeFirst()

            return list
        })

    return list
})

export const updateList = form(updateListSchema, async (data) => {

    const { id, ...values } = data

    const { numUpdatedRows } = await db
        .updateTable("list")
        .set(values)
        .where("id", "==", id)
        .executeTakeFirst()

    return numUpdatedRows
})

export const deleteList = form(deleteListSchema, async (data) => {

    const { id, ...values } = data

    const { numDeletedRows } = await db
        .deleteFrom("list")
        .where("id", "==", id)
        .executeTakeFirst()

    return numDeletedRows
})