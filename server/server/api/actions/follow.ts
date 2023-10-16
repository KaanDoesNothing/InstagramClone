import { ZTokenSchema } from "~/server/apiSchemas";
import { DB_Follower, DB_User } from "~/server/db";

export default defineEventHandler(async (e) => {
    if(e.req.method === "POST") {
        const body = await readBody(e);

        const isValid = ZTokenSchema.safeParse(body.token);
        if(!isValid.success) return {error: isValid.error.message};

        const author = await DB_User.findOne({token: body.token});
        const target = await DB_User.findOne({username: body.target});

        if(!author || !target) return;

        const newFollow = await DB_Follower.create({
            from: author,
            to: target
        });

        return {data: true};
    }
})