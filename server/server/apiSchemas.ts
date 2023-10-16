import { z } from "zod";

export const ZUserSchema = z.object({
    email: z.string().email(),
    password: z.string().min(5)
});

export const ZUsernameSchema = z.string().min(5)

export const ZTokenSchema = z.string().min(20);