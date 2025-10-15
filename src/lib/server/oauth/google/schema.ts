import { z } from "zod/v4";

export const google_schema = z.object({
    sub: z.string(),
    name: z.string(),
    email: z.string()
})