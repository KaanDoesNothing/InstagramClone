import {mongoose} from "../npm.ts";
import {CommentSchema, FollowerSchema, PostSchema, PostUserDataSchema, StorySchema, UserSchema} from "./schemas.ts";
import { ServerConfig } from "../config.ts";

//@ts-ignore
export const initDatabase = () => mongoose.connect(`mongodb://${ServerConfig.MONGODB_USER}:${ServerConfig.MONGODB_PASSWORD}@${ServerConfig.MONGODB_HOST}:${ServerConfig.MONGODB_PORT}`, {dbName: "InstaPost"});

export const DB_User = mongoose.model("User", UserSchema);
export const DB_Follower = mongoose.model("Follower", FollowerSchema);
export const DB_Story = mongoose.model("Story", StorySchema);
export const DB_Post = mongoose.model("Post", PostSchema);
export const DB_PostUserData = mongoose.model("PostUserData", PostUserDataSchema);
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
    const posts = await DB_Post.find({author: user}).sort({createdAt: -1}).populate("author").lean();
    const friends = await Promise.all(followers.map(async row => {
        const match = following.filter(row1 => row.from === row1.from);

        if(match) {
            return {
                ...row.from,
                stories: await DB_Story.find({author: row.from._id, createdAt:{$gte: new Date(Date.now() - 24*60*60*1000)}}).sort({createdAt: 1}).lean()
            };
        }
    }));

    const stories = await DB_Story.find({author: user._id, createdAt:{$gte: new Date(Date.now() - 24*60*60*1000)}}).sort({createdAt: -1}).lean();
    const postUserData = await DB_PostUserData.find({author: user._id}).populate("post").lean();

    return {
        ...user,
        followers,
        following: following,
        posts,
        friends,
        stories,
        postUserData
    }
}