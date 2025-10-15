import { z } from "zod/v4";

export const google_claims_schema = z.object({
    name: z.string(),
    email: z.string()
})