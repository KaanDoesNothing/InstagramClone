import { ZCommentSchema, ZPostSchema } from "~/server/apiSchemas";
import { DB_Comment, DB_Post, DB_User, cleanUser } from "~/server/db";

export default defineEventHandler(async (e) => {
    if(e.req.method === "POST") {
        const body = await readBody(e);

        const comments = await DB_Comment.find({post: body._id}).sort({createdAt: -1}).populate("author");

        return {
            data: comments.map(comment => {
                return {
                    ...comment.toObject(),
                    author: cleanUser(comment.author)
                }
            })
        }
    }
})