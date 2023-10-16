import { useRoute } from "nuxt/app";
import { ZTokenSchema } from "~/server/apiSchemas";
import { DB_Follower, DB_Post, DB_User, prepareUser } from "~/server/db";

export default defineEventHandler(async (e) => {
    if(e.req.method === "POST") {
        const body = await readBody(e);

        const visitor = await DB_User.findOne({token: body.token});
        if(!visitor) return;

        const user = await prepareUser({username: e.context.params?.username as string});

        return {data: {...user}};
    }
});