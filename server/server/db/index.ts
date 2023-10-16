import mongoose from "mongoose";
import {FollowerSchema, PostSchema, UserSchema} from "~/server/db/schemas";

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