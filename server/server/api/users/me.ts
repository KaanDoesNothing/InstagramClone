import { ZTokenSchema } from "~/server/apiSchemas";
import { DB_User } from "~/server/db";

export default defineEventHandler(async (e) => {
    if(e.req.method === "POST") {
        const body = await readBody(e);

        const isValid = ZTokenSchema.safeParse(body.token);
        if(!isValid.success) return {error: isValid.error.message};

        const user = await DB_User.findOne({token: body.token});

        return {data: user};
    }
});