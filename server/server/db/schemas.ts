import mongoose from "mongoose";

export const UserSchema = new mongoose.Schema({
    avatar: {type: mongoose.SchemaTypes.String, required: false, default: "https://archive.org/download/discordprofilepictures/discordblue.png"},
    username: {type: mongoose.SchemaTypes.String, required: true},
    email: {type: mongoose.SchemaTypes.String, required: true},
    password: {type: mongoose.SchemaTypes.String, required: true},
    token: {type: mongoose.SchemaTypes.String, required: true},
    description: {type: mongoose.SchemaTypes.String, required: false, default: "New User"},
    followers: [{type: mongoose.SchemaTypes.ObjectId, ref: "Follower"}],
    following: [{type: mongoose.SchemaTypes.ObjectId, ref: "Follower"}]
}, {timestamps: true});

export const FollowerSchema = new mongoose.Schema({
    from: {type: mongoose.SchemaTypes.ObjectId, ref: "User"},
    to: {type: mongoose.SchemaTypes.ObjectId, ref: "User"}
}, {timestamps: true});

export const PostSchema = new mongoose.Schema({
    author: {type: mongoose.SchemaTypes.ObjectId, ref: "User", required: true},
    source: {type: mongoose.SchemaTypes.String, required: true},
    description: {type: mongoose.SchemaTypes.String, required: true, default: ""},
    comments: [{type: mongoose.SchemaTypes.ObjectId, ref: "Comment", required: true}]
}, {timestamps: true});

export const CommentSchema = new mongoose.Schema({
    author: {type: mongoose.SchemaTypes.ObjectId, ref: "User", required: true},
    post: {type: mongoose.SchemaTypes.ObjectId, ref: "Post", required: true},
    content: {type: mongoose.SchemaTypes.String, required: true}
}, {timestamps: true});