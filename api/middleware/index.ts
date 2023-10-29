import { Context } from "oak/mod.ts";
import { User } from "../db/entities/user.ts";

declare module "oak/mod.ts" {
    class Context {
        session?: any;
    }
}

export const requiresToken = async (ctx: Context, next) => {
    const token = ctx.request.headers.get("Authorization");
    const isNotRequired = ctx.request.headers.get("isNotRequired");

    if(!token && !isNotRequired) {
        ctx.response.body = {error: "Token required"};
        return;
    }

    const user = await User.findOne({where: {token}, relations: {likes: {post: true}, bookmarks: {post: true}, stories: true, posts: true, followers: {target: true, author: true}, following: {target: true, author: true}}});
    if(!user) throw "err";

    ctx.session = user;

    await next();
}