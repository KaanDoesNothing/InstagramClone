import { ZPostSchema } from "~/server/apiSchemas";
import { DB_Post, DB_User } from "~/server/db";

export default defineEventHandler(async (e) => {
    if(e.req.method === "POST") {
        const body = await readBody(e);

        const isValid = ZPostSchema.safeParse(body);
        if(!isValid.success) return {error: isValid.error.message};

        const author = await DB_User.findOne({token: body.token});
        if(!author) return;

        const newPost = await DB_Post.create({
            author,
            source: body.source,
            description: body.description
        });

        return {data: true};
    }
})