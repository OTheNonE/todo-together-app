import { z } from "zod/v4"

export const listSchema = z.object({
    id: z.number(),
    name: z.string()
})

export const selectListSchema = listSchema.pick({ id: true })
export const createListSchema = listSchema.omit({ id: true })
export const updateListSchema = listSchema.partial().required({ id: true })
export const deleteListSchema = listSchema.pick({ id: true })

export const ownerOfListSchema = z.object({
    id: z.number(),
    user_id: z.string(),
    list_id: z.string(),
})

export const selectOwnerOfListSchema = ownerOfListSchema.pick({ id: true })
export const createOwnerOfListSchema = ownerOfListSchema.omit({ id: true })
export const updateOwnerOfListSchema = ownerOfListSchema.partial().required({ id: true })
export const deleteOwnerOfListSchema = ownerOfListSchema.pick({ id: true })