import { ZTokenSchema } from "~/server/apiSchemas";
import { DB_Follower, DB_Post, DB_User } from "~/server/db";

export default defineEventHandler(async (e) => {
    if(e.req.method === "POST") {
        const body = await readBody(e);

        const recentPosts = await DB_Post.find().sort({createdAt: -1}).populate("author");

        return {data: recentPosts};
    }
})