import { ZCommentSchema, ZPostSchema } from "~/server/apiSchemas";
import { DB_Comment, DB_Post, DB_User } from "~/server/db";

export default defineEventHandler(async (e) => {
    if(e.req.method === "POST") {
        const body = await readBody(e);

        const isValid = ZCommentSchema.safeParse(body);
        if(!isValid.success) return {error: isValid.error.message};

        const author = await DB_User.findOne({token: body.token});
        if(!author) return;

        const post = await DB_Post.findOne({_id: body._id});

        const newPost = await DB_Comment.create({
            author,
            post,
            content: body.content
        });

        return {data: true};
    }
})