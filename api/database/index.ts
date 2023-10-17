import {mongoose} from "../npm.ts";
import {CommentSchema, FollowerSchema, PostSchema, UserSchema} from "./schemas.ts";
import { ServerConfig } from "../config.ts";

//@ts-ignore
export const initDatabase = () => mongoose.connect(`mongodb://${ServerConfig.MONGODB_USER}:${ServerConfig.MONGODB_PASSWORD}@${ServerConfig.MONGODB_HOST}:${ServerConfig.MONGODB_PORT}`, {dbName: "InstaPost"});

export const DB_User = mongoose.model("User", UserSchema);
export const DB_Follower = mongoose.model("Follower", FollowerSchema);
export const DB_Post = mongoose.model("Post", PostSchema);
export const DB_Comment = mongoose.model("Comment", CommentSchema);

export const cleanUser = (user: any) => {
    user.password = undefined;
    user.token = undefined;
    return user;
}

export const prepareUser = async (user: any): Promise<{
    user: any;
    username?: string,
    followers: any[],
    following: any[],
    posts: any[],
    token: undefined,
    email: undefined,
    password: undefined
}> => {
    if(!user) throw "err";
    const followers = await DB_Follower.find({to: user._id}).sort({createdAt: -1}).populate("from", {username: true, avatar: true}).populate("to", {username: true, avatar: true}).lean();
    const following = await DB_Follower.find({from: user._id}).sort({createdAt: -1}).populate("from", {username: true, avatar: true}).populate("to", {username: true, avatar: true}).lean();
    const posts = await DB_Post.find({author: user}).sort({createdAt: -1}).lean();

    return {
        ...user,
        followers,
        following: following,
        posts
    }
}