import {Application, Router} from "oak/mod.ts"
import { DB_ChatMessage, DB_Comment, DB_Follower, DB_Post, DB_PostUserData, DB_Story, DB_User, initDatabase, preparePost, prepareUser } from "./database/index.ts"
import { requiresToken } from "./middleware/index.ts";
import { oakCors } from "cors/mod.ts";
import { comparePassword } from "./utils.ts";

console.time("Database");
await initDatabase();
console.timeEnd("Database");


const APIServer = new Application();
APIServer.use(oakCors({preflightContinue: true, optionsSuccessStatus: 200}));

export const router = new Router({prefix: "/api/v1"});

router.get("/", (ctx) => {
    ctx.response.body = {hello: "world"};
});

router.get("/user/me", requiresToken, async (ctx) => {
    const user = await prepareUser(ctx.session);

    ctx.response.body = {data: user};
});

router.put("/user/story", requiresToken, async (ctx) => {
    const body = await ctx.request.body({type: "json"}).value;

    const user = await DB_User.findOne({username: ctx.session.username});

    await DB_Story.create({
        author: user,
        source: body.source,
        content: body.content
    });

    ctx.response.body = {data: true};
});

router.put("/user/post", requiresToken, async (ctx) => {
    const body = await ctx.request.body({type: "json"}).value;

    const user = await DB_User.findOne({username: ctx.session.username});

    await DB_Post.create({
        author: user,
        source: body.source,
        description: body.content
    });

    ctx.response.body = {data: true};
});

router.put("/user/:username/follow", requiresToken, async (ctx) => {
    const author = await DB_User.findOne({username: ctx.session.username});
    const user = await DB_User.findOne({username: ctx.params.username});

    await DB_Follower.create({
        from: author,
        to: user
    });

    ctx.response.body = {data: true};
});

router.delete("/user/:username/follow", requiresToken, async (ctx) => {
    const author = await DB_User.findOne({username: ctx.session.username});
    const user = await DB_User.findOne({username: ctx.params.username});

    await DB_Follower.deleteOne({
        from: author,
        to: user
    });

    ctx.response.body = {data: true};
})

router.get("/user/:username", async (ctx) => {
    const user = await DB_User.findOne({username: ctx.params.username}, {username: true, avatar: true, description: true}).lean();
    const prepared = await prepareUser(user);

    ctx.response.body = {data: prepared};
});

router.get("/user/:username/posts", async (ctx) => {
    const user = await DB_User.findOne({username: ctx.params.username});
    const posts = await DB_Post.find({author: user}).sort({createdAt: -1}).lean();

    ctx.response.body = {data: posts};
});

router.put("/post/:post/like", requiresToken, async (ctx) => {
    const author = await DB_User.findOne({username: ctx.session.username});
    const post = await DB_Post.findOne({_id: ctx.params.post});
    const postData = await DB_PostUserData.findOne({author, post});

    if(postData) {
        postData.liked = true;
        await postData.save();
    }else {
        await DB_PostUserData.create({
            author,
            post,
            liked: true
        });
    }

    ctx.response.body = {data: true};
});

router.delete("/post/:post/like", requiresToken, async (ctx) => {
    const author = await DB_User.findOne({username: ctx.session.username});
    const post = await DB_Post.findOne({_id: ctx.params.post});
    const postData = await DB_PostUserData.findOne({author, post});

    if(postData) {
        postData.liked = false;
        await postData.save();
    }

    ctx.response.body = {data: true};
});

router.put("/post/:post/save", requiresToken, async (ctx) => {
    const author = await DB_User.findOne({username: ctx.session.username});
    const post = await DB_Post.findOne({_id: ctx.params.post});
    const postData = await DB_PostUserData.findOne({author, post});

    if(postData) {
        postData.saved = true;
        await postData.save();
    }else {
        await DB_PostUserData.create({
            author,
            post,
            saved: true
        });
    }

    ctx.response.body = {data: true};
});

router.delete("/post/:post/save", requiresToken, async (ctx) => {
    const author = await DB_User.findOne({username: ctx.session.username});
    const post = await DB_Post.findOne({_id: ctx.params.post});
    const postData = await DB_PostUserData.findOne({author, post});

    if(postData) {
        postData.saved = false;
        await postData.save();
    }

    ctx.response.body = {data: true};
});

router.get("/post/:post", requiresToken, async (ctx) => {

})

router.get("/user/:username/post/:id/comments", async (ctx) => {
    const post = await DB_Post.findOne({_id: ctx.params.id});
    const comments = await DB_Comment.find({post}).sort({createdAt: -1}).populate("author", {username: true, avatar: true}).lean();

    ctx.response.body = {data: comments};
});

router.get("/general/recent/posts", async (ctx) => {
    const posts = await DB_Post.find().populate("author", {username: true, avatar: true}).sort({createdAt: -1});

    ctx.response.body = {data: await Promise.all(posts.map(post => preparePost(post)))};
});

router.post("/auth/login", async (ctx) => {
    const body = await ctx.request.body({type: "json"}).value;

    const user = await DB_User.findOne({email: body.email});
    if(!user) return ctx.response.body = {error: {message: "User doesn't exist"}};

    const passwordCorrect = body.password === user.password || await comparePassword(body.password, user.password);
    if(!passwordCorrect) return ctx.response.body = {error: {message: "Invalid password"}};

    ctx.response.body = {data: user.token};
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