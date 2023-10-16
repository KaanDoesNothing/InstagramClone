import { z } from "zod";

export const ZUserSchema = z.object({
    email: z.string().email(),
    password: z.string().min(5)
});

export const ZUsernameSchema = z.string().min(5);

export const ZTokenSchema = z.string().min(20);

export const ZPostSchema = z.object({
    source: z.string().url(),
    description: z.string().min(1)
});

export const ZCommentSchema = z.object({
    token: ZTokenSchema,
    _id: z.string(),
    content: z.string()
})