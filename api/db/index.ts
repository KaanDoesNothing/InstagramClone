import "npm:reflect-metadata";
import "npm:pg";

import { DataSource } from "npm:typeorm";
import { ServerConfig } from "../config.ts";
import { User } from "./entities/user.ts";
import { Post } from "./entities/post.ts";
import { Comment } from "./entities/comment.ts";
import { Story } from "./entities/story.ts";
import { Follower } from "./entities/follower.ts";
import { Like } from "./entities/like.ts";
import { Bookmark } from "./entities/bookmark.ts";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: ServerConfig.PGSQL_HOST,
    port: 5432,
    username: ServerConfig.PGSQL_USERNAME,
    password: ServerConfig.PGSQL_PASSWORD,
    database: "InstaPost",
    synchronize: true,
    // logging: true,
    entities: [User, Post, Comment, Story, Follower, Like, Bookmark],
    subscribers: [],
    migrations: [],
})

await AppDataSource.initialize();