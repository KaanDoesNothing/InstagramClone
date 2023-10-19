import {Application, Router} from "oak/mod.ts"
import { DB_Comment, DB_Follower, DB_Post, DB_Story, DB_User, initDatabase, prepareUser } from "./database/index.ts"
import { requiresToken } from "./middleware/index.ts";
import { oakCors } from "cors/mod.ts";
import { comparePassword } from "./utils.ts";

console.time("Database");
await initDatabase();
console.timeEnd("Database");


const APIServer = new Application();
APIServer.use(oakCors({preflightContinue: true, optionsSuccessStatus: 200}));

const router = new Router({prefix: "/api/v1"});

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
})

router.get("/user/:username", async (ctx) => {
    const user = await DB_User.findOne({username: ctx.params.username}, {username: true, avatar: true}).lean();
    const prepared = await prepareUser(user);

    ctx.response.body = {data: prepared};
});

router.get("/user/:username/posts", async (ctx) => {
    const user = await DB_User.findOne({username: ctx.params.username});
    const posts = await DB_Post.find({author: user}).sort({createdAt: -1}).lean();

    ctx.response.body = {data: posts};
});

router.get("/user/:username/post/:id/comments", async (ctx) => {
    const post = await DB_Post.findOne({_id: ctx.params.id});
    const comments = await DB_Comment.find({post}).sort({createdAt: -1}).populate("author", {username: true, avatar: true}).lean();

    ctx.response.body = {data: comments};
});

router.get("/general/recent/posts", async (ctx) => {
    const posts = await DB_Post.find().sort({createdAt: -1}).populate("author", {username: true, avatar: true}).lean();

    ctx.response.body = {data: posts};
});

router.post("/auth/login", async (ctx) => {
    const body = await ctx.request.body({type: "json"}).value;

    const user = await DB_User.findOne({email: body.email});
    if(!user) return ctx.response.body = {error: {message: "User doesn't exist"}};

    const passwordCorrect = body.password === user.password || await comparePassword(body.password, user.password);
    if(!passwordCorrect) return ctx.response.body = {error: {message: "Invalid password"}};

    ctx.response.body = {data: user.token};
});

APIServer.use(router.routes()).use(router.allowedMethods());

await APIServer.listen({port: 3001});