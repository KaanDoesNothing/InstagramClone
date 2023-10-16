import { ZUserSchema } from "~/server/apiSchemas";
import {DB_User} from "~/server/db";
import {comparePassword} from "~/server/utils";

export default defineEventHandler(async (e) => {
    if(e.req.method === "POST") {
        const body = await readBody(e);
        const isValid = ZUserSchema.safeParse(body);
        if(!isValid.success) return {error: isValid.error.message};

        const user = await DB_User.findOne({email: body.email});
        if(!user) return {error: {message: "User doesn't exist"}};

        const passwordCorrect = body.password === user.password || await comparePassword(body.password, user.password);
        if(!passwordCorrect) return {error: {message: "Invalid password"}};

        return {data: {token: user.token}};
    }
});
