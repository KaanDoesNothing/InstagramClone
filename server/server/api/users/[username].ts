import { useRoute } from "nuxt/app";
import { ZTokenSchema } from "~/server/apiSchemas";
import { DB_Follower, DB_Post, DB_User } from "~/server/db";

export default defineEventHandler(async (e) => {
    if(e.req.method === "POST") {
        const body = await readBody(e);

        const visitor = await DB_User.findOne({token: body.token});
        if(!visitor) return;

        const user = await DB_User.findOne({username: e.context?.params?.username}).populate("followers");
        if(!user) return {error: {message: "User doesn't exist"}};

        const followers = await DB_Follower.find({to: user._id}).count();
        const following = await DB_Follower.find({from: user._id}).count();
        const isFollowing = await DB_Follower.findOne({from: visitor._id, to: user._id}).count();
        const posts = await DB_Post.find({author: user}).;

        return {data: {username: user.username, avatar: user.avatar, followers, following, isFollowing: isFollowing > 0, posts}};
    }
});