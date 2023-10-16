import mongoose from "mongoose";
import {CommentSchema, FollowerSchema, PostSchema, UserSchema} from "~/server/db/schemas";

const config = useRuntimeConfig();

export const initDatabase = () => new Promise(async (resolve, reject) => {
    try {
        console.log("Connecting to database");
        const db = await mongoose.connect(`mongodb://${config.app.env.MONGODB_USER}:${config.app.env.MONGODB_PASSWORD}@${config.app.env.MONGODB_HOST}:${config.app.env.MONGODB_PORT}`, {dbName: "InstaPost"});
        console.log("Connected to database");
        resolve(true);
    }catch(err) {
        console.log(err);
        reject(false);
    }
});

export const DB_User = mongoose.model("User", UserSchema);
export const DB_Follower = mongoose.model("Follower", FollowerSchema);
export const DB_Post = mongoose.model("Post", PostSchema);
export const DB_Comment = mongoose.model("Comment", CommentSchema);

export const cleanUser = (user: any) => {
    user.password = undefined;
    user.token = undefined;
    return user;
}

export const prepareUser = async ({username} :{username: string}): Promise<{
    username: string,
    followers: any[],
    following: any[],
    posts: any[],
    token: undefined,
    email: undefined,
    password: undefined
}> => {
    const user = await DB_User.findOne({username}).populate("followers");
    if(!user) throw "err";
    const followers = await DB_Follower.find({to: user._id}).sort({createdAt: -1}).populate("from").populate("to");
    const following = await DB_Follower.find({from: user._id}).sort({createdAt: -1}).populate("from").populate("to");
    const posts = await DB_Post.find({author: user}).sort({createdAt: -1}).populate("author").populate("comments");

    return {
        ...cleanUser(user.toObject()),
        followers: followers.map(row => {
            return {
                ...row,
                from: cleanUser(row.from),
                to: cleanUser(row.to)
            }
        }),
        following: following.map(row => {
            return {
                ...row,
                from: cleanUser(row.from),
                to: cleanUser(row.to)
            }
        }),
        posts
    }
}