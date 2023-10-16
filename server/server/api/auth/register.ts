import { ZUserSchema, ZUsernameSchema } from "~/server/apiSchemas";
import { DB_User } from "~/server/db";
import { hashPassword } from "~/server/utils";

export default defineEventHandler(async (e) => {
    if(e.req.method === "POST") {
        const body = await readBody(e);
        const isValid = ZUserSchema.safeParse(body);
        const isValidUsername = ZUsernameSchema.safeParse(body.username);
        if(!isValid.success) return {error: isValid.error};
        if(!isValidUsername.success) return {error: isValidUsername.error};

        const user = await DB_User.findOne({email: body.email});
        if(user) return {error: {message: "User already exists"}};

        const hashedPassword = await hashPassword(body.password);
        if(!hashedPassword) return {error: {message: "Couldn't hash password"}};

        const token = crypto.randomUUID();

        const newUser = DB_User.create({
            username: body.username,
            email: body.email,
            password: hashedPassword,
            token
        });

        return {token: token};
    }
})