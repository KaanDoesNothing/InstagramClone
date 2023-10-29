import {Application, Router} from "oak/mod.ts"
// import { DB_ChatMessage, DB_Comment, DB_Follower, DB_Post, DB_PostUserData, DB_Story, DB_User, initDatabase, preparePost, prepareUser } from "./database/index.ts"
import { requiresToken } from "./middleware/index.ts";
import { oakCors } from "cors/mod.ts";
import { comparePassword, hashPassword } from "./utils.ts";

import "./db/index.ts";
import { Post } from "./db/entities/post.ts";
import { User } from "./db/entities/user.ts";
import { Story } from "./db/entities/story.ts";
import { Follower } from "./db/entities/follower.ts";
import { Comment } from "./db/entities/comment.ts";
import { Like } from "./db/entities/like.ts";
import { Bookmark } from "./db/entities/bookmark.ts";

console.time("Database");
// await initDatabase();
console.timeEnd("Database");


const APIServer = new Application();
APIServer.use(oakCors({preflightContinue: true, optionsSuccessStatus: 200}));

export const router = new Router({prefix: "/api/v1"});

router.get("/", (ctx) => {
    ctx.response.body = {hello: "world"};
});

router.get("/user/me", requiresToken, (ctx) => {
    // const user = await prepareUser(ctx.session);
    const user = ctx.session;

    // console.log(user.username);

    ctx.response.body = {data: user};
});

router.put("/user/story", requiresToken, async (ctx) => {
    const body = await ctx.request.body({type: "json"}).value;

    const user = await User.findOne({where: {username: ctx.session.username}});

    const res = await Story.create({
        author: user,
        source: body.source,
        // content: body.content
    }).save();

    ctx.response.body = {data: res};
});

router.put("/user/post", requiresToken, async (ctx) => {
    const body = await ctx.request.body({type: "json"}).value;

    const user = await User.findOne({where: {username: ctx.session.username}});

    const res = await Post.create({
        author: user,
        source: body.source,
        description: body.content
    }).save();

    ctx.response.body = {data: res};
});

router.put("/user/:username/follow", requiresToken, async (ctx) => {
    const author = await User.findOne({where: {username: ctx.session.username}});
    const user = await User.findOne({where: {username: ctx.params.username}});

    const res = await Follower.create({
        author: author,
        target: user
    }).save();

    ctx.response.body = {data: res};
});

router.delete("/user/:username/follow", requiresToken, async (ctx) => {
    // const author = await User.findOne({where: {username: ctx.session.username}});
    const user = await User.findOne({where: {username: ctx.params.username}});

    const row = await Follower.findOne({where: {
        author: ctx.session.id,
        target: user.id
    }});

    const res = await row.remove();

    ctx.response.body = {data: res};
})

router.get("/user/:username", async (ctx) => {
    const user = await User.findOne({where: {username: ctx.params.username}, relations: {comments: true, stories: true, posts: {author: true}, followers: {target: true, author: true}, following: {target: true, author: true}}});
    // const prepared = await prepareUser(user);

    ctx.response.body = {data: user};
});

router.put("/post/:post/like", requiresToken, async (ctx) => {
    const author = await User.findOne({where: {username: ctx.session.username}});
    const post = await Post.findOne({where: {id: parseInt(ctx.params.post)}});

    await Like.create({
        author,
        post
    }).save();

    ctx.response.body = {data: true};
});

router.delete("/post/:post/like", requiresToken, async (ctx) => {
    const author = await User.findOne({where: {username: ctx.session.username}});
    const post = await Post.findOne({where: {id: parseInt(ctx.params.post)}});

    await Like.delete({
        author: author.id,
        post: post.id
    });

    ctx.response.body = {data: true};
});

router.put("/post/:post/save", requiresToken, async (ctx) => {
    const author = await User.findOne({where: {username: ctx.session.username}});
    const post = await Post.findOne({where: {id: parseInt(ctx.params.post)}});

    await Bookmark.create({
        author,
        post
    }).save();

    ctx.response.body = {data: true};
});

router.delete("/post/:post/save", requiresToken, async (ctx) => {
    const author = await User.findOne({where: {username: ctx.session.username}});
    const post = await Post.findOne({where: {id: parseInt(ctx.params.post)}});

    await Bookmark.delete({
        author: author.id,
        post: post.id
    });

    ctx.response.body = {data: true};
});

router.get("/post/:post", requiresToken, async (ctx) => {

})

router.get("/user/:username/post/:id/comments", async (ctx) => {
    const post = await Post.findOne({where: {id: parseInt(ctx.params.id)}, relations: {}});
    const comments = await Comment.find({where: {post: post.id}, relations: {author: true}});
    // .so({createdAt: -1}).populate("author", {username: true, avatar: true}).lean();

    ctx.response.body = {data: comments};
});

router.get("/general/recent/posts", async (ctx) => {
    const posts = await Post.find({relations: {author: true}});
    // const posts = await DB_Post.find().populate("author", {username: true, avatar: true}).sort({createdAt: -1});

    ctx.response.body = {data: posts};
});

router.post("/auth/login", async (ctx) => {
    const body = await ctx.request.body({type: "json"}).value;

    const user = await User.findOne({where: {email: body.email}});
    if(!user) return ctx.response.body = {error: {message: "User doesn't exist"}};

    const passwordCorrect = body.password === user.password || await comparePassword(body.password, user.password);
    if(!passwordCorrect) return ctx.response.body = {error: {message: "Invalid password"}};

    ctx.response.body = {data: user.token};
});

router.post("/auth/register", async (ctx) => {
    const body = await ctx.request.body({type: "json"}).value;

    const user = await User.findOne({where: {email: body.email}});
    if(user) return {error: {message: "User already exists"}};

    const hashedPassword = await hashPassword(body.password);
    if(!hashedPassword) return {error: {message: "Couldn't hash password"}};

    const token = crypto.randomUUID();

    await User.create({
        username: body.username,
        email: body.email,
        password: hashedPassword,
        token
    }).save();

    ctx.response.body = {data: true};
});

router.get("/user/:username/chat", requiresToken, async (ctx) => {
    const user = await DB_User.findOne({username: ctx.params.username});
    if(!user) throw "err";

    const chat = await DB_ChatMessage.find().or([{from: user._id, to: ctx.session._id}, {from: ctx.session._id, to: user._id}]).populate("from").populate("to");

    ctx.response.body = {data: chat};
});

router.put("/user/:username/chat", requiresToken, async (ctx) => {
    const body = await ctx.request.body({type: "json"}).value;

    const author = await DB_User.findOne({_id: ctx.session._id});
    const user = await DB_User.findOne({username: ctx.params.username});
    if(!user) throw "err";

    await DB_ChatMessage.create({
        from: author,
        to: user,
        content: body.content
    });

    ctx.response.body = {data: true};
});

APIServer.use(router.routes()).use(router.allowedMethods());

await APIServer.listen({port: 4905});