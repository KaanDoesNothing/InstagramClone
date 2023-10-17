import { Context } from "oak/mod.ts";
import { DB_User } from "../database/index.ts";

declare module "oak/mod.ts" {
    class Context {
        session?: any;
    }
}

export const requiresToken = async (ctx: Context, next) => {
    const token = ctx.request.headers.get("Authorization");
    if(!token) {
        ctx.response.body = {error: "Token required"};
        return;
    }

    const user = await DB_User.findOne({token: token}, {username: true, avatar: true, email: true}).lean();
    if(!user) throw "err";

    ctx.session = user;

    await next();
}