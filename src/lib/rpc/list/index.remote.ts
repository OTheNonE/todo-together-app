import { form, query } from "$app/server";
import { db } from "$lib/server/db";
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
    const { insertId } = await db
        .insertInto("list")
        .values(values)
        .executeTakeFirst()

    return insertId
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