import {z} from "zod";

export const messageSchema = z.object({
    content: z.string()
    .min(10, {message: "content must be at least 10 characters long"})
    .max(300, {message: "content must be at most 300 characters long"})
});